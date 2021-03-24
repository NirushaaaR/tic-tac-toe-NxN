import React, { useState } from 'react'
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
                // game end
                setState(PlayState.WAITING);
                break;
            default:
                break;
        }
    }

    const handleClick = (i, j) => {

        if (board[i][j] !== 0) return;

        const value = state === PlayState.PLAYER_TURN ? 1 : state === PlayState.BOT_TURN ? -1 : 0;
        const newTurn = state === PlayState.PLAYER_TURN ? PlayState.BOT_TURN : state === PlayState.BOT_TURN ? PlayState.PLAYER_TURN : PlayState.WAITING;
        const newBoard = [...board];
        newBoard[i][j] = value;
        setBoard(newBoard);
        setState(newTurn);

    }


    return (
        <div>
            <label>Choose Size: </label>
            <input type="number" value={size} onChange={onSizeChange} min={3} />

            <div>
                {board.map((row, i) => (
                    <div className="board-row" key={i}>
                        {row.map((square, j) => <Square key={i + j} value={square} handleClick={() => handleClick(i, j)} />)}
                    </div>
                ))}
            </div>

            <button onClick={onClickState} disabled={state === PlayState.PLAYER_TURN || state === PlayState.BOT_TURN}>{state}</button>
        </div>
    )
}

const generateBoard = (size) => {

    const board = [];
    for(let i=0; i< size; i++) {
        const row = [];
        for(let j=0; j<size; j++) {
            row.push(0)
        }
        board.push(row);
    }

    return board;
}

export default Board
