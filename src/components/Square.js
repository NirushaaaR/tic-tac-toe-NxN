import React from 'react'
import PropTypes from 'prop-types';

const Square = ({ value, handleClick }) => {
    return (
        <button className="square" onClick={handleClick} style={value === 0 ? blankStyle : nonBlankStyle} disabled={value !== 0}>
            {value === 1 ? "X" : "O"}
        </button>
    )
}

Square.propTypes = {
    value: PropTypes.number.isRequired,
    handleClick: PropTypes.func.isRequired,
}

const blankStyle = {
    color: "white",
    background: "white",
}

const nonBlankStyle = {
    color: "black",
}

export default Square;
