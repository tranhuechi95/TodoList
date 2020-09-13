import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Login = ({formDisplayFunction, formDisplay}) => {
    let [loginInputUsername, setLoginInputUsername] = useState('');
    let [loginInputPassword, setLoginInputPassword] = useState('');
    let [checkUsername, setCheckUsername] = useState('');
    let [checkPassword, setCheckPassword] = useState('');

    let normalFormClass = 'form-control';
    let errorFormClass = 'form-control error';
    let validFormClass = 'form-control success'
    
    let [usernameErrorMsg, setUsernameErrorMsg] = useState('');
    let [passwordErrorMsg, setPasswordErrorMsg] = useState('');

    let history = useHistory();
    
    const loginSubmitHandler = (loginEvent) => {
        loginEvent.preventDefault();
        let flag = true;
        if (loginInputUsername === '') {
            setCheckUsername(false);
            setUsernameErrorMsg("Username cannot be empty");
            flag = false;
        } 
        if (loginInputPassword === '') {
            setCheckPassword(false);
            setPasswordErrorMsg("Password cannot be empty");
            flag = false;
        } 
        if (flag) {
            // here, we would like to send a request to login
            fetch('/login', {
                method: 'POST',
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }),
                body: JSON.stringify({
                    loginUsername: loginInputUsername,
                    loginPassword: loginInputPassword, 
                })
            }).then(res => res.text())
            .then(textRes => {
                if (textRes === "Valid username") {
                    // alert("You are login");
                    history.push(`/todolist/${loginInputUsername}`);
                } else if (textRes === "Username does not exists") {
                    // here, I want to attach the class error to the username form-control
                    setCheckUsername(false);
                    setUsernameErrorMsg("Your username does not exist, please signup!");
                } else if (textRes === "Your password is wrong") {
                    // here, I want to attach the class error to the password form-control
                    setCheckUsername(false);
                    setUsernameErrorMsg("Your username could be wrong");
                    setCheckPassword(false);
                    setPasswordErrorMsg("Your password could be wrong");
                }
                console.log(textRes);
            }).catch(err => console.log(err));
            setLoginInputUsername('')
            setLoginInputPassword('');
        }
    }
    return (
        <section className="main-container-login">
            <header class="header-form" onClick={formDisplayFunction}>
                <div>LOG IN</div>
            </header>
            <form onSubmit={loginSubmitHandler} className={formDisplay}>
                <div className={checkUsername === '' ? normalFormClass : (checkUsername === false ? errorFormClass : validFormClass)}>
                    <label>Username</label>
                    <input type="text" placeholder="Your username" value={loginInputUsername} 
                        onChange={(event) => setLoginInputUsername(event.target.value)} />
                    <FontAwesomeIcon class="exclamation-circle" icon='exclamation-circle'/>
                    <small>{usernameErrorMsg}</small>
                </div>
                <div className={checkPassword === '' ? normalFormClass : (checkPassword === false ? errorFormClass : validFormClass)}>
                    <label>Password</label>
                    <input type="password" placeholder="Your password" value={loginInputPassword} 
                        onChange={(event) => setLoginInputPassword(event.target.value)} />
                    <FontAwesomeIcon class="exclamation-circle" icon='exclamation-circle'/>
                    <small>{passwordErrorMsg}</small>
                </div>
                <div className="button-container">
                    <input className="button" type="submit" value="SIGN IN" />
                </div>
            </form>
        </section>
    )
}

export default Login;