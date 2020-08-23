import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Mainpage from './mainpage';

const App = () => {
    return (
        <Switch>
            <Route exact path="/" component={Mainpage} />
            <Route exact path="/anothermain" component={Mainpage} />
        </Switch>
    )
};

export default App;
