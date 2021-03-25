import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { logOut } from '../../firebase';
import { UserContext } from '../../UserProvider';

const Navbar = () => {

    const user = useContext(UserContext);

    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand nav-link" to="/play/">Play</Link>
                {user && (
                    <div className="d-flex">
                        <Link className="nav-link" to="/replay/">Watch Replay</Link>
                        <button className="btn btn-outline-success me-2" onClick={logOut}>Logout</button>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
