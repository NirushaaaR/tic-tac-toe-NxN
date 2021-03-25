import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { logOut } from '../../service/firebase';
import { UserContext } from '../../UserProvider';

const Navbar = () => {

    const user = useContext(UserContext);

    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                <h1 className="navbar-brand">Tic Tac Toe</h1>
                {user && (
                    <div className="d-flex">
                        <Link className="nav-link" to="/play/">Play</Link>
                        <Link className="nav-link" to="/replay/">Watch Replay</Link>
                        <button className="btn btn-outline-danger me-2" onClick={logOut}>Logout</button>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
