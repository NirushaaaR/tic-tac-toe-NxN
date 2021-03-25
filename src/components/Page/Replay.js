import React, { useContext, useEffect, useState } from 'react'
import { Redirect } from 'react-router';
import { db } from '../../firebase';
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
            db.collection("history")
                .where("uid", "==", user.uid)
                .orderBy("time")
                .get()
                .then(querySnapshot => {
                    const allReplay = [];
                    querySnapshot.forEach(doc => {
                        allReplay.push(doc.data());
                    });
                    setReplay(allReplay);
                })
                .catch(error => alert(error.message));
        }
    }, [user]);
    if (redirect) {
        return <Redirect to={redirect} />;
    }

    const chooseReplay = (i) => {
        const chosenReplay = replay[i];
        const board = generateBoard(chosenReplay.size);
        board[chosenReplay.history[0].i][chosenReplay.history[0].j] = chosenReplay.history[0].value;
        setReplayBoard(board);
        setReplayMoves(chosenReplay.history);
        setCurrentState(chosenReplay.history[0].turn);
    }

    const chooseMoves = (i) => {
        const board = replayBoard.map(row => row.map(r => 0));
        // recreate board
        for (let j = 0; j <= i; j++) {
            board[replayMoves[j].i][replayMoves[j].j] = replayMoves[j].value;
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
