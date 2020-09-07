import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Mainpage from './screens/mainpage';
import LoginSignUp from './screens/loginSignup';

const App = () => {
    return (
        <Switch>
            <Route exact path="/" component={LoginSignUp} />
            <Route exact path="/todolist/:username" component={Mainpage} />
        </Switch>
    )
};

export default App;