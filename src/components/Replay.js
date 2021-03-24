import React, { useContext, useEffect, useState } from 'react'
import { Redirect } from 'react-router';
import { UserContext } from '../UserProvider';

const Replay = () => {

    const user = useContext(UserContext);
    const [redirect, setredirect] = useState(null);

    useEffect(() => {
        if (!user) {
            setredirect("/");
        }
    }, [user]);
    if (redirect) {
        <Redirect to={redirect} />;
    }

    return (
        <div>
            Replay Route
        </div>
    )
}

export default Replay
