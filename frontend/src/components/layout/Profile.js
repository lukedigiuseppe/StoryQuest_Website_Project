import React, {Component} from 'react';
import {Container, Row, Col, Jumbotron, Button, Form, Input} from 'reactstrap';
import ProfileNavBar from './profileNavBar'
import MobileMenu2 from './MobileMenu';
import '../../css/profile.css';
import {Helmet} from "react-helmet";
import axios from 'axios';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';


class Profile extends Component {
    // We always have a constructor if we need the component to maintain some sort of state information. Such as the data that is input by a user from a form.
    // Constructors always need to have props passed in and super(props) called. Don't ask why, just do it.
    constructor(props) {
        super(props);

        // We then declare our initial state for the component here. For a form it is usually just a bunch of empty strings, for each of the input fields.
        // In this example we will just be pulling the user's profile info from the backend. We will also be sending some dummy information to a sample route
        // on the backend to demonstrate how to POST requests to the backend.

        // When pulling data from the backend take a look at the backend route and look for the "get" route and then see what res.send() sends. Usually a JSON object. Which
        // can be accessed with the dot-notation.
        this.state = {
            publicName: "",
            firstName: "",
            lastName: "",
            location:"",
            dateCreated: "",

            // Then we also have fields in the state for holding the form data. Which we will call field1, field2, field3 here
            field1: "",
            field2: "",
            field3: "",
            field4: ""
        }
    }

    // For pulling data from the backend we usually call the lifecycle method componentDidMount which is called before the first render of the component
    componentDidMount() {
        // Then we use axios.get to pull the data in, .then basically serves to wait until the userinfo is pulled and then it gets executed. It requires a callback
        // function. Basically a function in it. We define this callback using the arrow notation from javascript just for simplicity. res stands for the response object which contains a lot of stuff,
        // you can print it out to console to see but it's massive. What we want is the .data part of it which contains the data sent by the backend
        axios.get('/userinfo')
            .then(res => {
                // We then call setState here to assign the information we got back into our state so that we can render it.
                this.setState({
                    publicName: res.data.publicName,
                    firstName: res.data.firstName,
                    lastName: res.data.lastName,
                    location: res.data.location,
                    dateCreated: res.data.dateCreated,
                    avatarImg: res.data.avatarImg
                })
            })
            .catch(err => {
                // This catches any errors such as 400 replies etc. or any errors from the backend. How you deal with it is up to you. But usually printing an error to the console,
                // or you can have a separate error field in the state that you can check for errors in the render method.
                console.log(err);
            });
    }


    onChange = (e) => {
        // This is basically the same function for every component. e stands for event and has the target attribute. The target then has the following attributes
        // id, name, type and value. These attributes correspond to the attributes specified in the <input> tag. We can use the shorthand below that automatically
        // matches the id of the input field to its corresponding field in the component state.
        this.setState({ [e.target.id]: e.target.value });
    }
    render() {
        return(
            <div className="profile">
                {/* Change the header for the home menu */}
                <Helmet>
                    <title>My Profile</title>
                </Helmet>
                {/* Different navmenu bar to appear depending on whether it is viewed from a small or large screen */}
                    <Container className="d-none d-lg-flex"><ProfileNavBar /></Container>
                    <Container className="d-lg-none"><MobileMenu2 /></Container>
                <br /><br /><br />

                <Container className="profileBox">
                            <img className ="profilePic" src='/images/thomas.jpeg' alt='user profile pic'/>
                            <div className="d-flex justify-content-center">
                                <p className="name">{this.state.publicName}</p>
                            </div>


                <div className="d-flex justify-content-center"><img className ="icon" src='/images/locationpin.png' alt='location icon'/>Location: {this.state.location}</div>
                    <div className="d-flex justify-content-center"><img className ="icon" src='/images/tick.png' alt='date joined icon'/>Joined: {this.state.dateCreated}</div>
                    <Row></Row>
                    <Row></Row>
                    <Row></Row>

                    <br></br><br></br>
                    <br></br><br></br>
                </Container>
                <br></br><br></br>
                <Container className="profileBox">
                    <p> CREDITS (WILL MOD LATER):<br></br><a href="https://icons8.com/icon/19326/map-pin">Map Pin icon by Icons8</a><br></br>
                        <a href="https://icons8.com/icon/102561/verified-account">Verified Account icon by Icons8</a>
                    </p>
                    <br></br>

                   </Container>


            </div>

        )
    }
}

Profile.propTypes = {
    auth: PropTypes.object.isRequired
};

// MapStateToProps is a function we define and is only required when accessing the store for the global state of the application. This basically allows us to automatically assign the global state object to this component and
// then pass it in as props. Thus we are then allowed to access it from within the component by calling this.props.auth. Note we call auth here because that is the name of the authorisation state from the
// store that I have created. Just use auth and follow it, should work for all components that we will be making.
const mapStateToProps = state => ({
    auth: state.auth
});

// Now is the important part, here we have to connect the component to the store (remember global app state is stored there). To do this we have to write in the following format for the export
// export default connect("pass the mapStateToProps function here")(class_name) where class_name is the name of this react component.

export default connect(mapStateToProps)(Profile);