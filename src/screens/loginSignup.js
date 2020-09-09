import React, { useState } from 'react';
import Login from '../components/login';
import Signup from '../components/signup';

const LoginSignUp = () => {
    let [loginFormDisplay, setLoginFormDisplay] = useState('form-login-signup');
    let [signupFormDisplay, setSignupFormDisplay] = useState('form-login-signup');

    const logInHeaderFunction = () => {
        // this will slide out the form
        if (loginFormDisplay === 'form-login-signup') {
            setLoginFormDisplay('form-login-signup selected');
            setSignupFormDisplay('form-login-signup');
        } else setLoginFormDisplay('form-login-signup');
    }

    const signUpHeaderFunction = () => {
        if (signupFormDisplay === 'form-login-signup') {
            setSignupFormDisplay('form-login-signup selected');
            setLoginFormDisplay('form-login-signup');
        } else setSignupFormDisplay('form-login-signup');
}
    return(
        <div className="mainpage-container-form">
            <Login formDisplayFunction={logInHeaderFunction} formDisplay={loginFormDisplay}/>
            <Signup formDisplayFunction={signUpHeaderFunction} formDisplay={signupFormDisplay}/>
        </div>
    )
}

export default LoginSignUp;