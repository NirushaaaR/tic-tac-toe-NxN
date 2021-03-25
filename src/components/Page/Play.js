import React, { useContext, useEffect, useState } from 'react'
import { Redirect } from 'react-router';
import { getUserStat, saveReplay, updateUserStat } from '../../service/api';
import { UserContext } from '../../UserProvider';
import { checkWinner, generateBoard } from '../../utils/board';
import Board from '../Board/Board';
import PlayerStat from '../Layout/PlayerStat';

const PlayState = {
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

    const user = useContext(UserContext);
    const [redirect, setredirect] = useState(null);

    useEffect(() => {
        if (!user) {
            setredirect("/");
        } else {
            getUserStat(user, setStat);
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
        
        const winner = checkWinner(size, board);

        if (!winner) {
            // change turn
            return state === PlayState.PLAYER_TURN
                ? PlayState.BOT_TURN
                : state === PlayState.BOT_TURN
                    ? PlayState.PLAYER_TURN
                    : PlayState.WAITING;
        } else {
            setWinningSquare(winner[1]);
            if (winner[0] === 0) return PlayState.DRAW;
            if (winner[0] === 1) return PlayState.PLAYER_WIN;
            if (winner[0] === -1) return PlayState.BOT_WIN;
        }

    }

    const botTurn = (board, state) => {

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

    const gameStart = () => {
        // start a with random first turn
        const fisrtTurn = Math.random() > 0.5 ? PlayState.PLAYER_TURN : PlayState.BOT_TURN;

        // bot go first
        if (fisrtTurn === PlayState.BOT_TURN) {
            const action = botTurn(board, fisrtTurn)[1];
            setHistory([action]);
        }
        else setState(fisrtTurn);
    }

    const gameEnd = (history, winState, newBoard) => {
        // game end;
        saveReplay(history, winState, size, user.uid);

        const newStat = { ...stat };
        if (winState === PlayState.PLAYER_WIN) {
            newStat.win += 1;
            setStat(newStat);
        } else if (winState === PlayState.BOT_WIN) {
            newStat.lose += 1;
            setStat(newStat);
        }
        // update stat
        updateUserStat(user.uid, newStat);
        setState(winState);
        setBoard(newBoard);
    }

    const gameReset = () => {
        // Reset game
        setHistory([]);
        setWinningSquare([]);
        setBoard(generateBoard(size));
        setState(PlayState.WAITING);
    }

    const onClickStartOrReset = () => {
        switch (state) {
            case PlayState.WAITING:
                gameStart();
                break;
            case PlayState.PLAYER_WIN:
            case PlayState.BOT_WIN:
            case PlayState.DRAW:
                gameReset();
                break;
            default:
                break;
        }
    }

    const handleClickSquare = (i, j) => {

        if (board[i][j] !== 0 || (state !== PlayState.PLAYER_TURN && state !== PlayState.BOT_TURN)) return;

        const action = [];
        const value = 1;
        const newBoard = [...board];
        newBoard[i][j] = value;
        action.push({
            i, j, value,
            turn: state,
        });
        let newState = nextPlayState(state, newBoard, size);

        // operate bot turn
        if (newState === PlayState.BOT_TURN) {
            const [nextState, botAction] = botTurn(newBoard, newState);
            action.push(botAction);
            newState = nextState;
        }

        if (newState === PlayState.BOT_WIN || newState === PlayState.PLAYER_WIN || newState === PlayState.DRAW) {
            gameEnd([...history, ...action], newState, newBoard);
        } else {
            setHistory([...history, ...action]);
        }
    }

    return (
        <div>
            {state === PlayState.WAITING ? (
                <div className="choose-size">
                    <label>Choose Size: </label>
                    <input type="number" value={size} onChange={onSizeChange} min={1} />
                </div>

            ) : (
                <div className="turn-state">
                    {state}
                </div>
            )}

            {state !== PlayState.PLAYER_TURN && state !== PlayState.BOT_TURN ? (
                <button onClick={onClickStartOrReset} className="btn btn-primary my-2">
                    {state === PlayState.WAITING ? "Click To Start Game" : "Reset"}
                </button>
            ) : null}

            <Board board={board} handleClick={handleClickSquare} highlightSquare={winningSquare} />

            {user ? <PlayerStat displayName={user.displayName} win={stat.win} lose={stat.lose} /> : null}
        </div>
    )
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
