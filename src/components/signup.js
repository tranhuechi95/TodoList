import React, { useState } from 'react';

const Signup = () => {
    let [signupInputUsername, setSignupInputUsername] = useState('');
    let [signupInputPassword, setSignupInputPassword] = useState('');
    let [signupInputRetypePassword, setSignupInputRetypePassword] = useState('');
    let [checkUsername, setCheckUsername] = useState('');
    let [checkPassword, setCheckPassword] = useState('');
    let [checkPassword2, setCheckPassword2] = useState('');

    let normalFormClass = 'form-control';
    let errorFormClass = 'form-control error';
    let validFormClass = 'form-control success';
    
    let [usernameErrorMsg, setUsernameErrorMsg] = useState('');
    let [passwordErrorMsg, setPasswordErrorMsg] = useState('');
    let [password2ErrorMsg, setPassword2ErrorMsg] = useState('');

    const signUpSubmitHandler = (loginEvent) => {
        loginEvent.preventDefault();
        let flag = true;
        if (signupInputUsername === '') {
            setCheckUsername(false);
            setUsernameErrorMsg("Username cannot be empty!");
            flag = false;
        } else {
            setCheckUsername(true);
        }

        if (signupInputPassword === '') {
            setCheckPassword(false);
            setPasswordErrorMsg("Password cannot be empty");
            flag = false;
        } else {
            // simple for now
            setCheckPassword(true);
        }
        if (signupInputRetypePassword === '') {
            setCheckPassword2(false);
            setPassword2ErrorMsg("Verify password cannot be empty");
            flag = false;
        } else if (signupInputPassword !== signupInputRetypePassword) {
            setSignupInputPassword('');
            setSignupInputRetypePassword('');
            setCheckPassword(false);
            setCheckPassword2(false);
            setPasswordErrorMsg("Passwords do not match");
            setPassword2ErrorMsg("Passwords do not match");
            flag = false;
        } else {
            setCheckPassword(true);
            setCheckPassword2(true);
        }
        if (flag) {
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
                    // alert("Please choose another username");
                    setSignupInputUsername('');
                    setCheckUsername(false);
                    setUsernameErrorMsg("Please choose another username");
                }
            })
        }
        
    }
    return (
        <section className="main-container">
            <header className="header">
                <div>SIGN UP</div>
            </header>
            <form onSubmit={signUpSubmitHandler} className="form-input">
                <div className={checkUsername === '' ? normalFormClass : (checkUsername === false ? errorFormClass : validFormClass)}>
                    <label>Username</label>
                    <input type="text" placeholder="Your username" value={signupInputUsername} 
                            onChange={(event) => setSignupInputUsername(event.target.value)} />
                    <small className="error-msg">{usernameErrorMsg}</small>
                </div>
                <div className={checkPassword === '' ? normalFormClass : (checkPassword === false ? errorFormClass : validFormClass)}>
                    <label>Password</label>
                    <input type="password" placeholder="Your chosen password" value={signupInputPassword} 
                            onChange={(event) => setSignupInputPassword(event.target.value)} />
                    <small className="error-msg">{passwordErrorMsg}</small>
                </div>
                <div className={checkPassword2 === '' ? normalFormClass : (checkPassword2 === false ? errorFormClass : validFormClass)}>
                    <label>Verify password</label>
                    <input type="password" placeholder="Retype your password" value={signupInputRetypePassword} 
                            onChange={(event) => setSignupInputRetypePassword(event.target.value)} />
                    <small className="error-msg">{password2ErrorMsg}</small>
                </div>

                <div className="button-container">
                    <input className="button" type="submit" value="SIGN UP" />
                </div> 
            </form>
        </section>
    )
}

export default Signup;