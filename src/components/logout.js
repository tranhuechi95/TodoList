import React from 'react';
import { Link } from 'react-router-dom';

const Logout = ({user}) => {
    return (
        <div className="main-container-logout">
            <div><Link to="/" className="logout-link">{`LOGOUT FOR ${user}`}</Link></div>
        </div>
    )
}

export default Logout;