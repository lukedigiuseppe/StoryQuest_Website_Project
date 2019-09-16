import React from 'react';
import ReactDOM from 'react-dom';
import {Route, BrowserRouter as Router} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

// Import CSS files
import 'bootstrap/dist/css/bootstrap.min.css'
import './css/customTheme.css'

// Import our React components
import App from './App';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Add the routes to the different pages from that you can access from the Navbar
const routing = (
    <Router>
        <div>
            <Route exact path="/" component={App} />  
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
        </div>
    </Router>
)
   
ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
