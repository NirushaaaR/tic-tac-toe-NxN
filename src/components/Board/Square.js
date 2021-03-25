import React from 'react'
import PropTypes from 'prop-types';

const Square = ({ value, handleClick, highlight }) => {
    return (
        <button
            className="square"
            onClick={handleClick}
            style={value === 0 ? blankStyle : highlight ? hightLightStyle : nonBlankStyle}
        >
            {value === 1 ? "X" : "O"}
        </button>
    )
}

Square.propTypes = {
    value: PropTypes.number.isRequired,
    handleClick: PropTypes.func.isRequired,
    highlight: PropTypes.bool.isRequired,
}

const blankStyle = {
    color: "white",
    background: "white",
}

const nonBlankStyle = {
    color: "black",
    background: "white",
}

const hightLightStyle = {
    color: "red",
}

export default Square;
