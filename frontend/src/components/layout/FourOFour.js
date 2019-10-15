// This is a react component that displays a 404 page whenever some artifact cannot be found or a user cannot be found
import React, {Component} from 'react';
import {Helmet} from 'react-helmet';
import '../../css/fourOFour.css';

class FourOFour extends Component {

    render() {
        return (
            <div id="notfound">
                <Helmet> 
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                    <title>404 Resource not found</title>
                </Helmet>
                <div className="notfound">
                    <div className="notfound-404"></div>
                    <h1>404</h1>
                    <h2>Oops! User or Artifact Cannot Be Found</h2>
                    <p>Sorry but the page you are looking for does not exist, have been removed. name changed or is temporarily unavailable</p>
                    <a href="/">Back to homepage</a>
                </div>
            </div>
        )
    }

}

export default FourOFour;