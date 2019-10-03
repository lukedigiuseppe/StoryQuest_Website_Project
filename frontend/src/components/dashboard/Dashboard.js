// This is the page is protected and can only be viewed when the user logins

import React, { Component } from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../../actions/authActions";
import axios from "axios";

const encrypt = require('../../utils/encryption').encrypt;

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: '',
            videoID: "",
            artifactID: ""
        }

        this.test = this.test.bind(this);
    }

    test = () => {
        console.log("method called");
        axios.get('/findUser')
        .then(response => {
          this.setState({ message: response.data });
        })
        .catch(error => {
          console.log(error);
        });
        console.log(this.state.message);
    }

    onLogoutClick = (e) => {
        e.preventDefault();
        this.props.logoutUser();
    };

    onChange = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = (e) => {

        e.preventDefault();
        const data = encrypt(this.state.videoID);

        // axios.post('/delete_video/' + this.state.artifactID, data)
        //     .then(res => {
        //         console.log(res);
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     })
        
        axios.delete('/delete_image/' + this.state.artifactID + '/' + this.state.videoID)
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        })
    }

    render() {
        // The user here refers to the decoded JWT token. It is a JSON Object with fields specified in the login route in users.js in the backend
        const { user } = this.props.auth;
        return(
            <div style={{ height: "76vh"}} className="container valign-wrapper">
                <div className="row">
                    <div className="col s12 center-align">
                        <h4>
                            <b>Hey there,</b> {user.name}
                            <p className="flow-text grey-text text-darken-1">
                                You are logged into a full-stack{" "}<span style={{ fontFamily: "monospace"}}>MERN</span> app 👏
                            </p>
                            <p><button onClick={this.test}>Test me and check the console to see the info you get back.</button></p>
                            <p><a href="/add_artifact">Add an artifact</a></p> 
                        </h4>
                        <button style={{width: "150px", borderRadius: "3px", letterSpacing: "1.5px", marginTop: "1rem"}} onClick={this.onLogoutClick} className="btn btn-large waves-effect waves-light hoverable blue accent-3">Logout</button>
                        <br />
                        <form onSubmit={this.onSubmit}>
                            <input type="text" id="artifactID" placeholder="Enter artifact ID" onChange={this.onChange} value={this.state.artifactID} />
                            <br />
                            <input type="text" id="videoID" placeholder="Enter video ID" onChange={this.onChange} value={this.state.videoID} />
                            <br />
                            <button style={{width: "150px", borderRadius: "3px", letterSpacing: "1.5px", marginTop: "1rem"}} type="submit" className="btn btn-large hoverable blue accent-3">Delete Video</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

Dashboard.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser}
)(Dashboard);