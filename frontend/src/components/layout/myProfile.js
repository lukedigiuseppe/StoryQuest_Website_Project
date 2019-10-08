import React, {Component} from 'react';
import {Container, Row, Col, Jumbotron, Button, Form, Input} from 'reactstrap';
import ProfileNavBar from './profileNavBar';
import MobileMenu2 from './MobileMenu';
import ArtifactBlock from './ArtifactBlock';
import '../../css/myProfile.css';
import {Helmet} from "react-helmet";
import axios from 'axios';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';


class myProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            birthDate: "",
            publicName: "",
            firstName: "",
            lastName: "",
            location:"",
            dateCreated: "",
            artifacts: []
        }
    }


    componentDidMount() {
    axios.all([
        axios.get('/userinfo'),
        axios.get('/artifacts')])
            .then(axios.spread((userRes, artiRes) => {
                this.setState({
                    email: userRes.data.email,
                    birthDate: userRes.data.birthDate,
                    publicName: userRes.data.publicName,
                    firstName: userRes.data.firstName,
                    lastName: userRes.data.lastName,
                    location: userRes.data.location,
                    dateCreated: userRes.data.dateCreated,
                    artifacts: artiRes.data
                });
            }))
                .catch(err => {// This catches any errors such as 400 replies etc. or any errors from the backend. How you deal with it is up to you. But usually printing an error to the console,
                    // or you can have a separate error field in the state that you can check for errors in the render method.
                    console.log(err);
                });
    }


    onChange = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    }

    artifactList() {
        return this.state.artifacts.map(function(currentArtifact, i){
            return <li key={i}><ArtifactBlock artifactData={currentArtifact} /></li>;
        });
    }

    render() {
        return(
            <div className="myProfile">
                {/* Change the header for the home menu */}
                <Helmet>
                    <title>My Profile</title>
                </Helmet>
                {/* Different navmenu bar to appear depending on whether it is viewed from a small or large screen */}
                <Container className="d-none d-lg-flex"><ProfileNavBar /></Container>
                <Container className="d-lg-none"><MobileMenu2 /></Container>
                <br /><br /><br />
                <br /><br /><br />
                <Container>
                    <Row>
                        <Col sm={{ size: 'auto', offset: 1}}>
                            <Container className="picBox">
                                <img className ="profilePic" src='/images/thomas.jpeg' alt='user profile pic'/>
                                <div className="d-flex justify-content-center">
                                    <p className="greeting">Hi {this.state.publicName}!</p>
                                </div>
                        </Container></Col>
                        <Col sm={{ size: '7', offset: 1.5 }}>
                            <Container className="profileBox">
                                <div className="d-flex justify-content-left"> <p className="name">Public Name: {this.state.publicName}</p></div>
                                <div className="d-flex justify-content-left"><p className="name">First Name: {this.state.firstName}</p></div>
                                <div className="d-flex justify-content-left"> <p className="name">Last Name: {this.state.lastName}</p></div>
                                <div className="d-flex justify-content-left"><p className="name">Email: {this.state.email}</p></div>
                                <div className="d-flex justify-content-left"><p className="name">Location: {this.state.location}</p></div>
                                <div className="d-flex justify-content-left"><p className="name">Date Joined: {this.state.dateCreated}</p></div>
                            </Container>
                            </Col>
                        <Col></Col>
                    </Row>
                </Container>
                <br></br><br></br>
                {this.state.artifacts.map(function(currentArtifact, i){
                    return <ArtifactBlock artifactData={currentArtifact} />;
                })}    
            </div>
        )
    }
}

myProfile.propTypes = {
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

export default connect(mapStateToProps)(myProfile);