import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Switch, BrowserRouter as Router} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import { Provider } from "react-redux";
import store from "./store";

// Import CSS files
import 'bootstrap/dist/css/bootstrap.min.css'
import './css/customTheme.css'

// Import our React components
import App from './App';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
import AddArtifact from "./components/layout/AddArtifact";
import ViewArtifact from "./components/layout/ViewArtifact";
import Profile from "./components/layout/Profile";

import FileUpload from "./components/layout/FileUpload";
import Image from "./components/layout/Image";

// Check for token to keep the user logged in

if (localStorage.jwtToken) {
    // Set auth header
    const token = localStorage.jwtToken;
    setAuthToken(token);
    // Decode token and get user info and expiry
    const decoded = jwt_decode(token);
    // Set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded));

    // Check for an expired token
    const currentTime = Date.now() / 1000; // Math to get it into milliseconds
    if (decoded.exp < currentTime) {
        // Logout user
        store.dispatch(logoutUser());

        // Redirect to login
        window.location.href = "./login";
    }
}

// Add the routes to the different pages from that you can access from the Navbar
const routing = (
    <Provider store={store}>
        <Router>
            <div>
                <Route exact path="/" component={App} />  
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/add_artifact" component ={AddArtifact} />
                <Route exact path="/view_artifact" component ={ViewArtifact} />
                <Route exact path="/profile" component ={Profile} />
                <Route exact path="/file_upload" component={FileUpload} />
                <Route exact path="/image" component={Image} />
                <Switch>
                    <PrivateRoute exact path='/dashboard' component={Dashboard} />
                </Switch>
            </div>
        </Router>
    </Provider>
)
   
ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
