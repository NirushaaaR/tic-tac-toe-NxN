import React from 'react'
import Square from './Square';
import PropTypes from 'prop-types';

const Board = ({ board, handleClick, highlightSquare }) => {
    return (
        <div className="board">
            {board.map((row, i) => (
                <div className="board-row" key={i}>
                    {row.map((square, j) =>
                        <Square
                            key={`${i}${j}`}
                            value={square}
                            handleClick={() => handleClick(i, j)}
                            highlight={highlightSquare.some(v => v[0] === i && v[1] === j)}
                        />)}
                </div>
            ))}
        </div>
    )
}

Board.propTypes = {
    board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    handleClick: PropTypes.func.isRequired,
    highlightSquare: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
}

export default Board;
