import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import 'antd/dist/antd.css'
import routes from "./components/routes";

function App() {

    return (
        <Router>
            <Switch>
                {routes.map((route, idx) => {
                    return <Route path={route.path} exact={route.exact} key={idx}>
                        {<route.layout>
                            {<route.component/>}
                        </route.layout>}
                    </Route>
                })}
                <Redirect from='*' to='/notfound'/>
            </Switch>
        </Router>
    );
}

export default App;
