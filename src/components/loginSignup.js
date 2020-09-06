import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

const Login = () => {
    let [loginInputUsername, setLoginInputUsername] = useState('');
    let [loginInputPassword, setLoginInputPassword] = useState('');
    let history = useHistory();

    const loginSubmitHandler = (loginEvent) => {
        loginEvent.preventDefault();
        if (loginInputPassword === '' || loginInputUsername === '') {
            alert("You forget to input login information");
        } else {
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
                    alert("You are login");
                    history.push(`/todolist/${loginInputUsername}`);
                } else if (textRes === "Username does not exists") {
                    alert("Your username does not exist, please signup!");
                } else if (textRes === "Your password is wrong") {
                    alert("Your password or username is wrong");
                }
                console.log(textRes);
            }).catch(err => console.log(err));
            setLoginInputUsername('')
            setLoginInputPassword('');
        }
    }
    return (
        <section>
            <h3>SIGN IN</h3>
            <form onSubmit={loginSubmitHandler} className="form-input">
                <label>Username
                    <input type="text" placeholder="Your username" value={loginInputUsername} 
                        onChange={(event) => setLoginInputUsername(event.target.value)} />
                </label>
                <label>Password
                    <input type="password" placeholder="Your password" value={loginInputPassword} 
                        onChange={(event) => setLoginInputPassword(event.target.value)} />
                </label>    
                <input type="submit" value="SIGN IN" />
            </form>
        </section>
    )
}

const Signup = () => {
    let [signupInputUsername, setSignupInputUsername] = useState('');
    let [signupInputPassword, setSignupInputPassword] = useState('');
    let [signupInputRetypePassword, setSignupInputRetypePassword] = useState('');

    const signUpSubmitHandler = (loginEvent) => {
        loginEvent.preventDefault();
        if (signupInputPassword === '' || signupInputUsername === '' || setSignupInputRetypePassword === '') {
            alert("You forget to input signup information");
        } else {
            if (signupInputPassword !== signupInputRetypePassword) {
                alert("Your retyped password does not match");
                setSignupInputPassword('');
                setSignupInputRetypePassword('');
            } else {
                // here, we would send a POST request to signup
                fetch('/signup', {
                    method: 'POST',
                    headers: new Headers({
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }),
                    body: JSON.stringify({
                        signupUsername: signupInputUsername,
                        signupPassword: signupInputPassword,
                    })
                }).then(res => res.text())
                .then(textRes => {
                    if (textRes === "Signup is successful") {
                        alert("Your signup is successful, please login to start");
                        setSignupInputUsername('');
                        setSignupInputPassword('');
                        setSignupInputRetypePassword('');
                    } else if (textRes === "Username already exists") {
                        alert("Please choose another username");
                        setSignupInputUsername('');
                    }
                })
            }
        }
    }
    return (
        <section>
            <h3>SIGN UP</h3>
            <form onSubmit={signUpSubmitHandler} className="form-input">
                <div>
                    <label>Set Username
                        <input type="text" placeholder="Your username" value={signupInputUsername} 
                            onChange={(event) => setSignupInputUsername(event.target.value)} />
                    </label>
                </div>
                <div>
                    <label>Set Password
                        <input type="password" placeholder="Your password" value={signupInputPassword} 
                            onChange={(event) => setSignupInputPassword(event.target.value)} />
                    </label>
                </div>
                <div>
                    <label>Verify Password
                        <input type="password" placeholder="Retype your password" value={signupInputRetypePassword} 
                            onChange={(event) => setSignupInputRetypePassword(event.target.value)} />
                    </label>  
                </div>
                 
                <input type="submit" value="SIGN UP" />
            </form>
        </section>
    )
}

const LoginSignUp = () => {
    return(
        <div className="mainpage-container">
            <Login />
            <Signup />
            {/* <div>
                <Link to="/todolist">Add to list</Link>
            </div> */}
        </div>
    )
}

export default LoginSignUp;