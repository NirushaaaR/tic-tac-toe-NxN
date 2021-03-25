import React, { useContext, useEffect, useState } from 'react'
import { Redirect } from 'react-router';
import { getHistory } from '../../service/api';
import { UserContext } from '../../UserProvider';
import Board from '../Board/Board';
import { generateBoard } from './Play';
// import {generateBoard} from '../Page/Play';

const Replay = () => {

    const user = useContext(UserContext);
    const [redirect, setredirect] = useState(null);

    const [replay, setReplay] = useState([]);
    const [replayBoard, setReplayBoard] = useState(null);
    const [replayMoves, setReplayMoves] = useState([]);
    const [currentState, setCurrentState] = useState("");

    useEffect(() => {
        if (!user) {
            setredirect("/");
        } else {
            getHistory(user, setReplay)
        }
    }, [user]);
    if (redirect) {
        return <Redirect to={redirect} />;
    }

    const chooseReplay = (i) => {
        const history = replay[i].history;
        console.log(history);
        const board = generateBoard(replay[i].size);
        board[history[0].i][history[0].j] = history[0].value;

        setReplayBoard(board);
        setReplayMoves(history);
        setCurrentState(history[0].turn);
    }

    const chooseMoves = (i) => {
        const board = replayBoard.map(row => row.map(r => 0));
        // recreate board
        for (let index = 0; index <= i; index++) {
            board[replayMoves[index].i][replayMoves[index].j] = replayMoves[index].value;
        }

        setReplayBoard(board);
        setCurrentState(replayMoves[i].turn);
    }

    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col-md-3 text-start border border-dark rounded">
                    Replay List
                {replay.map((r, i) => (
                    <div className="my-3" key={i}>
                        <button
                            onClick={() => chooseReplay(i)}
                            className="btn btn-primary"
                        >
                            {`Game ${i + 1} ${r.outcome}`}
                        </button>
                    </div>
                ))}
                </div>

                <div className="col-md-9">
                    {replayBoard && <Board board={replayBoard} handleClick={() => { }} highlightSquare={[]} />}

                    <h3 className="play-state my-2">
                        {currentState}
                    </h3>

                    {replayMoves.map((m, i) => (
                        <button
                            className="m-2 btn btn-secondary"
                            key={i}
                            onClick={() => chooseMoves(i)}
                        >
                            {`move${i + 1}`}
                        </button>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default Replay
