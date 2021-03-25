import React, { useEffect, useContext, useState } from 'react';
import { signInWithGoogle } from '../../service/firebase';
import { UserContext } from '../../UserProvider';
import { Redirect } from 'react-router-dom';


const Login = () => {
    const user = useContext(UserContext);
    const [redirect, setredirect] = useState(null);

    useEffect(() => {
        if (user) {
            setredirect('/play/')
        }
    }, [user]);

    if (redirect) {
        return <Redirect to={redirect} />
    }

    return (
        <div className="login">
            <h1>Tic Tac Toe Game!!!</h1>
            <div className="login-buttons mt-3">
                <button className="btn btn-light border border-dark" onClick={signInWithGoogle}>
                    <img src="https://cdn.icon-icons.com/icons2/2119/PNG/512/google_icon_131222.png" alt="google icon" style={{width: "25px", height: "25px"}}/>
                    <span> Continue with Google</span>
                </button>
            </div>
        </div>
    );
}

export default Login;