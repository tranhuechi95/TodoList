import React from 'react';
import Login from '../components/login';
import Signup from '../components/signup';

const LoginSignUp = () => {
    return(
        <div className="mainpage-container">
            <Login />
            <Signup />
        </div>
    )
}

export default LoginSignUp;