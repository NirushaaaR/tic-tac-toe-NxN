import React, { useState } from 'react'
import Square from './Square';

const PlayState = {
    WAITING: "Waiting to play",
    PLAYER_TURN: "PLAYER Turn",
    BOT_TURN: "BOT Turn",
    PLAYER_WIN: "PLAYER WIN!!",
    BOT_WIN: "BOT WIN!!",
}

const Board = () => {

    const [boardState, setBoardState] = useState({
        size: 3,
        board: Array(3).fill(Array(3).fill(0))
    });
    const [state, setState] = useState(PlayState.WAITING);
    

    const onSizeChange = (e) => {
        if (state === PlayState.WAITING) {
            const newSize = Number(e.target.value);
            setBoardState({
                size: newSize,
                board: Array(newSize).fill(Array(newSize).fill(0))
            });
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


    return (
        <div>
            <label>Choose Size: </label>
            <input type="number" value={boardState.size} onChange={onSizeChange} min={3} />

            <div>
                {boardState.board.map((row,i) => (
                    <div className="board-row">
                        {row.map((square,j) => <Square key={i+j} value={square} handleClick={()=>alert([i,j])} />)}
                    </div>
                ))}
            </div>

            <button onClick={onClickState} disabled={state === PlayState.PLAYER_TURN || state === PlayState.BOT_TURN}>{state}</button>
        </div>
    )
}

export default Board
