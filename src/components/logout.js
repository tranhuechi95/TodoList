import React from 'react';
import { Link } from 'react-router-dom';

const Logout = () => {
    return (
        <div className="main-container-logout">
            <div><Link to="/" className="logout-link">Logout</Link></div>
        </div>
    )
}

export default Logout;