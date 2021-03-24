import React, { useContext, useEffect, useState } from 'react'
import { Redirect } from 'react-router';
import { db } from '../firebase';
import { UserContext } from '../UserProvider';
import Square from './Square';

const PlayState = {
    WAITING: "Click To Start",
    PLAYER_TURN: "PLAYER Turn",
    BOT_TURN: "BOT Turn",
    PLAYER_WIN: "PLAYER WIN!!",
    BOT_WIN: "BOT WIN!!",
    DRAW: "DRAW!!",
}

const Board = () => {

    const [size, setSize] = useState(3);
    const [board, setBoard] = useState(generateBoard(3));
    const [state, setState] = useState(PlayState.WAITING);
    const [history, setHistory] = useState([]);

    const user = useContext(UserContext);
    const [redirect, setredirect] = useState(null);

    useEffect(() => {
        if (!user) {
            setredirect("/");
        }
    }, [user]);
    if (redirect) {
        <Redirect to={redirect} />;
    }


    const onSizeChange = (e) => {
        if (state === PlayState.WAITING) {
            const newSize = Number(e.target.value);
            setSize(newSize);
            setBoard(generateBoard(newSize));
        }
    }

    const onClickState = () => {
        switch (state) {
            case PlayState.WAITING:
                // start a game
                setState(PlayState.PLAYER_TURN);
                break;
            case PlayState.PLAYER_WIN:
            case PlayState.BOT_WIN:
            case PlayState.DRAW:
                // game end
                setHistory([]);
                setBoard(generateBoard(size));
                setState(PlayState.WAITING);
                break;
            default:
                break;
        }
    }

    const handleClick = (i, j) => {

        if (board[i][j] !== 0 || (state !== PlayState.PLAYER_TURN && state !== PlayState.BOT_TURN)) return;
        const action = [];
        const value = state === PlayState.PLAYER_TURN ? 1 : state === PlayState.BOT_TURN ? -1 : 0;
        const newBoard = [...board];
        newBoard[i][j] = value;
        action.push({
            i, j, 
            turn: state,
        });
        let newTurn = nextPlayState(state, newBoard, size);

        if (newTurn === PlayState.BOT_TURN) {
            const [boti, botj] = botPlay(newBoard);
            newBoard[boti][botj] = -1;
            action.push({
                i: boti, 
                j: botj, 
                turn: newTurn,
            });
            newTurn = nextPlayState(newTurn, newBoard, size);     
        }

        if (newTurn === PlayState.BOT_WIN || newTurn === PlayState.PLAYER_WIN || newTurn === PlayState.DRAW) {
            // game end;
            // save replay to db
            db.collection("history").add({
                history: [...history, ...action],
                outcome: newTurn,
                size: size,
                uid: user.uid,
            });
        }

        setHistory([...history, ...action]);
        setState(newTurn);
        setBoard(newBoard);
    }


    return (
        <div>
            {state === PlayState.WAITING ? (
                <div>
                    <label>Choose Size: </label>
                    <input type="number" value={size} onChange={onSizeChange} min={3} />
                </div>

            ) : (
                <div className="turn-state">
                    {state}
                </div>
            )}

            <div>
                {board.map((row, i) => (
                    <div className="board-row" key={i}>
                        {row.map((square, j) => <Square key={i + j} value={square} handleClick={() => handleClick(i, j)} />)}
                    </div>
                ))}
            </div>

            {state !== PlayState.PLAYER_TURN && state !== PlayState.BOT_TURN ? (
                <button onClick={onClickState}>
                    {state === PlayState.WAITING ? "Click To Start Game" : "Reset"}
                </button>
            ) : null}
        </div>
    )
}

const generateBoard = (size) => {

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

const nextPlayState = (state, board, size) => {
    // sum up all horizontal, vertical Diagonal 
    // if we can sum it to size than player win
    // if we can sum it to -size than bot win

    // checking if zero exists if not than all square has been place and will draw.
    let zeroExists = false;

    // horizontal & vertical & Diagonal
    let sumDiagonalLeft = 0;
    let sumDiagonalRight = 0;
    for (let i = 0; i < size; i++) {
        let sumHorizontal = 0;
        let sumVertical = 0;

        sumDiagonalLeft += board[i][i];
        sumDiagonalRight += board[i][size - i - 1];

        for (let j = 0; j < size; j++) {
            sumHorizontal += board[i][j];
            sumVertical += board[j][i];
            zeroExists = zeroExists || board[i][j] === 0;
        }

        if (sumHorizontal === size || sumVertical === size) {
            return PlayState.PLAYER_WIN;
        } else if (sumHorizontal === -size || sumVertical === -size) {
            return PlayState.BOT_WIN;
        }
    }

    // Diagonal check
    if (sumDiagonalLeft === size || sumDiagonalRight === size) {
        return PlayState.PLAYER_WIN;
    } else if (sumDiagonalLeft === -size || sumDiagonalRight === -size) {
        return PlayState.BOT_WIN;
    }

    // Draw
    if (!zeroExists) {
        return PlayState.DRAW;
    }

    // change turn
    return state === PlayState.PLAYER_TURN ? PlayState.BOT_TURN : state === PlayState.BOT_TURN ? PlayState.PLAYER_TURN : PlayState.WAITING;

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

export default Board
