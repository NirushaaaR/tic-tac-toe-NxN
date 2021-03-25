import React, { useContext, useEffect, useState } from 'react'
import { Redirect } from 'react-router';
import { db } from '../../firebase';
import { UserContext } from '../../UserProvider';

const Replay = () => {

    const user = useContext(UserContext);
    const [redirect, setredirect] = useState(null);
    const [replay, setReplay] = useState([]);

    useEffect(() => {
        if (!user) {
            setredirect("/");
        } else {
            db.collection("history")
                .where("uid", "==", user.uid)
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
        <Redirect to={redirect} />;
    }

    return (
        <div>
            Replay Route {`${replay}`}
        </div>
    )
}

export default Replay
