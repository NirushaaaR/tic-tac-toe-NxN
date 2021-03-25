import React, { useContext, useEffect, useState } from 'react'
import { Redirect } from 'react-router';
import { db, getServerTimeStamp } from '../../firebase';
import { UserContext } from '../../UserProvider';
import Board from '../Board/Board';
import PlayerStat from '../PlayerStat';

export const PlayState = {
    WAITING: "WAITING TO START",
    PLAYER_TURN: "PLAYER Turn",
    BOT_TURN: "BOT Turn",
    PLAYER_WIN: "PLAYER WIN!!",
    BOT_WIN: "BOT WIN!!",
    DRAW: "DRAW!!",
}

const Page = () => {

    const [size, setSize] = useState(3);
    const [board, setBoard] = useState(generateBoard(3));
    const [state, setState] = useState(PlayState.WAITING);
    const [history, setHistory] = useState([]);
    const [winningSquare, setWinningSquare] = useState([]);
    const [stat, setStat] = useState({ win: 0, lose: 0 });

    const getUserStat = () => {
        db.collection("userstat").doc(user.uid).get()
            .then((res) => {
                if (!res.exists) {
                    // create new
                    db.collection("userstat").doc(user.uid).set(stat);
                } else {
                    setStat(res.data());
                }
            })
    }

    const user = useContext(UserContext);
    const [redirect, setredirect] = useState(null);

    useEffect(() => {
        if (!user) {
            setredirect("/");
        } else {
            getUserStat();
        }
    }, [user]);

    if (redirect) {
        return <Redirect to={redirect} />;
    }


    const onSizeChange = (e) => {
        if (state === PlayState.WAITING) {
            const newSize = Number(e.target.value);
            setSize(newSize);
            setBoard(generateBoard(newSize));
        }
    }

    const nextPlayState = (state, board, size) => {
        let zeroExists = false;

        const checkArray = [];
        // horizontal & vertical & Diagonal
        const diagonalLeft = [];
        const diagonalRight = [];
        for (let i = 0; i < size; i++) {
            const horizontal = [];
            const vertical = [];
            diagonalLeft.push([i, i])
            diagonalRight.push([i, size - i - 1]);

            for (let j = 0; j < size; j++) {
                horizontal.push([i, j]);
                vertical.push([j, i]);
                zeroExists = zeroExists || board[i][j] === 0;
            }
            checkArray.push(horizontal);
            checkArray.push(vertical);
        }

        // Diagonal check
        checkArray.push(diagonalLeft);
        checkArray.push(diagonalRight);

        // check if player win
        const playerWin = checkArray.filter((check) => check.every(([i, j]) => board[i][j] === 1));
        if (playerWin.length > 0) {
            setWinningSquare(playerWin[0]);
            return PlayState.PLAYER_WIN;
        }

        const enemyWin = checkArray.filter((check) => check.every(([i, j]) => board[i][j] === -1));
        if (enemyWin.length > 0) {
            setWinningSquare(enemyWin[0]);
            return PlayState.BOT_WIN;
        }

        // Draw
        if (!zeroExists) {
            return PlayState.DRAW;
        }

        // change turn
        return state === PlayState.PLAYER_TURN
            ? PlayState.BOT_TURN
            : state === PlayState.BOT_TURN
                ? PlayState.PLAYER_TURN
                : PlayState.WAITING;

    }

    const onClickState = () => {
        switch (state) {
            case PlayState.WAITING:
                // start a game
                const fisrtTurn = Math.random() > 0.5 ? PlayState.PLAYER_TURN : PlayState.BOT_TURN;

                // bot go first
                if (fisrtTurn === PlayState.BOT_TURN) {
                    const action = botFlow(board, fisrtTurn)[1];
                    setHistory([action]);
                }
                else setState(fisrtTurn);

                break;
            case PlayState.PLAYER_WIN:
            case PlayState.BOT_WIN:
            case PlayState.DRAW:
                // Reset game
                setHistory([]);
                setWinningSquare([]);
                setBoard(generateBoard(size));
                setState(PlayState.WAITING);
                break;
            default:
                break;
        }
    }

    const botFlow = (board, state) => {

        const newBoard = [...board];

        // bot play
        const [boti, botj] = botPlay(newBoard);
        newBoard[boti][botj] = -1;

        const nextState = nextPlayState(state, newBoard, size);

        setBoard(newBoard);
        setState(nextState);

        return [nextState, {
            i: boti,
            j: botj,
            value: -1,
            turn: state,
        }];
    }

    const handleClick = (i, j) => {

        if (board[i][j] !== 0 || (state !== PlayState.PLAYER_TURN && state !== PlayState.BOT_TURN)) return;

        const action = [];
        const value = state === PlayState.PLAYER_TURN ? 1 : state === PlayState.BOT_TURN ? -1 : 0;
        const newBoard = [...board];
        newBoard[i][j] = value;
        action.push({
            i, j, value,
            turn: state,
        });
        let newState = nextPlayState(state, newBoard, size);

        if (newState === PlayState.BOT_TURN) {
            const [nextState, botAction] = botFlow(newBoard, newState);
            action.push(botAction);
            newState = nextState;
        }

        if (newState === PlayState.BOT_WIN || newState === PlayState.PLAYER_WIN || newState === PlayState.DRAW) {
            // game end;
            // save replay to db
            db.collection("history").add({
                history: [...history, ...action],
                outcome: newState,
                size: size,
                uid: user.uid,
                time: getServerTimeStamp(),
            });

            const newStat = { ...stat };
            if (newState === PlayState.PLAYER_WIN) {
                newStat.win += 1;
                setStat(newStat);
            } else if (newState === PlayState.BOT_WIN) {
                newStat.lose += 1;
                setStat(newStat);
            }
            // update stat
            db.collection("userstat").doc(user.uid).set(newStat);

            setState(newState);
            setBoard(newBoard);
        }

        setHistory([...history, ...action]);

    }


    return (
        <div>
            {state === PlayState.WAITING ? (
                <div>
                    <label>Choose Size: </label>
                    <input type="number" value={size} onChange={onSizeChange} min={1} />
                </div>

            ) : (
                <div className="turn-state">
                    {state}
                </div>
            )}

            {state !== PlayState.PLAYER_TURN && state !== PlayState.BOT_TURN ? (
                <button onClick={onClickState} className="btn btn-primary my-2">
                    {state === PlayState.WAITING ? "Click To Start Game" : "Reset"}
                </button>
            ) : null}

            <Board board={board} handleClick={handleClick} highlightSquare={winningSquare} />

            {user ? <PlayerStat displayName={user.displayName} win={stat.win} lose={stat.lose} /> : null}
        </div>
    )
}

export const generateBoard = (size) => {

    const board = [];
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            row.push(0)
        }
        board.push(row);
    }

    return board;
}

const botPlay = (board) => {
    // get all 0 and randomly fill it
    const zeros = [];
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] === 0) {
                zeros.push([i, j]);
            }
        }
    }

    // get random i,j
    return zeros[Math.floor((Math.random() * zeros.length))]
}

export default Page;
