import React, {Component} from 'react';
import {Container, Row, Col} from 'reactstrap';
import ProfileNavBar from './profileNavBar';
import MobileMenu2 from './MobileMenu';
import '../../css/myProfile.css';
import {Helmet} from "react-helmet";
import axios from 'axios';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Artifact = props => (
    <tr>
        <td>
            <Link to={"/view_artifact/"+props.artifacts._id}>{props.artifacts.name}</Link>
        </td>
        <td>{props.artifacts.story.substring(0,25)} ...</td>
        <td>{props.artifacts.dateMade} </td>
    </tr>
)

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
                console.log(artiRes)
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
                .catch(err => {
                    console.log(err);
                });
    }

    // artifactList() {
    //     return this.state.artifacts.map(function(currentArtifact, i){
    //         return <li key={i}><ArtifactBlock artifactData={currentArtifact} /></li>;
    //     });
    // }

    artifactList() {
        return this.state.artifacts.map(function(currArtifact, i){
            return <Artifact artifacts={currArtifact} key={i} />;
        })
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
                <Container className="artifactBox">
                <div>
                    <div className="d-flex justify-content-centre"> <p className="tMHeader">Your Artifacts</p></div>
                    <table className="table table-striped" size="sm" justify-content-centre>
                        <thead>
                        <tr>
                            <th className="tHeader">Name</th>
                            <th className="tHeader">Your Story</th>
                            <th className="tHeader">Date Made</th>
                        </tr>
                        </thead>
                        <tbody>
                        { this.artifactList() }
                        </tbody>
                    </table>
                </div>
                </Container>
            </div>
        )
    }
}

myProfile.propTypes = {
    auth: PropTypes.object.isRequired
};


const mapStateToProps = state => ({
    auth: state.auth
});


export default connect(mapStateToProps)(myProfile);