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
        <div>
            <h1>Tic Tac Toe Game!!!</h1>
            <div className="login-buttons mt-3">
                <button className="login-provider-button" onClick={signInWithGoogle}>
                    <img src="https://img.icons8.com/ios-filled/50/000000/google-logo.png" alt="google icon" />
                    <span> Continue with Google</span>
                </button>
            </div>
        </div>
    );
}

export default Login;