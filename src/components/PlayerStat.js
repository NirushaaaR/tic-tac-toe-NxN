import React from 'react'
import PropTypes from 'prop-types';

const PlayerStat = ({ displayName, win, lose }) => {

    return (
        <div>
            Player {displayName} {win} : {lose} BOT
        </div>
    )
}

PlayerStat.propTypes = {
    displayName: PropTypes.string.isRequired,
    win: PropTypes.number.isRequired,
    lose: PropTypes.number.isRequired,
}

export default PlayerStat
