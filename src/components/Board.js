import React, { useState } from 'react'
import Square from './Square';

const Board = () => {

    const [boardState, setBoardState] = useState({
        size: 3,
        board: Array(3).fill(Array(3).fill(0))
    });

    const onSizeChange = (e) => {
        const newSize = Number(e.target.value);
        setBoardState({
            size: newSize,
            board: Array(newSize).fill(Array(newSize).fill(0))
        });
    }


    const status = 'Next player: X';

    return (
        <div>
            <label>Choose Size: </label>
            <input type="number" value={boardState.size} onChange={onSizeChange} />

            <div>
                <h1>{status}</h1>
                {boardState.board.map((row,i) => (
                    <div className="board-row">
                        {row.map((square,j) => <Square key={i+j} value={square} handleClick={()=>alert([i,j])} />)}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Board
