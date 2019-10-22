import React, {Component} from 'react';
import {Container, Row, Col, Button} from 'reactstrap';
// import {Image } from 'react-native';
import ProfileNavBar from '../layout/profileNavBar';
import MobileMenu2 from '../layout/MobileMenu';
import '../../css/myProfile.css';
import {Helmet} from "react-helmet";
import axios from 'axios';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import EdiText from 'react-editext';
import Loading from '../layout/Loading';
import ArtifactBlock from '../layout/ArtifactProfile';
import { setUserLoading, setUserNotLoading } from "../../actions/authActions";

// Used to check if Friend email entered is a valid email
// import Validator from 'validator';

const Artifact = props => (
    <tr>
        <td>
            <Link to={"/view_artifact/"+props.artifacts._id}>{props.artifacts.name}</Link>
        </td>
        <td>{props.artifacts.story.substring(0,25)} ...</td>
        <td>{new Date(props.artifacts.dateMade).toDateString()} </td>
        <td>
            <Link to={"/edit_artifact/"+props.artifacts._id}>Edit</Link>
        </td>
        <td>
            <Link to={"/delete_artifact/"+props.artifacts._id}>Delete</Link>
        </td>
    </tr>
)

const MAX_FIELD_LEN = 50;
const NO_IMG = '/images/no-image-placeholder.png';

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
            userID:"",
            profileImgData: "",
            artifacts: [],
            tableView: false
        }

        this.onSavePublicName = this.onSavePublicName.bind(this);
        this.onSaveFirstName = this.onSaveFirstName.bind(this);
        this.onSaveLastName = this.onSaveLastName.bind(this);
        this.onSaveEmail = this.onSaveEmail.bind(this);
        this.onSaveLocation = this.onSaveLocation.bind(this);
    }


    componentDidMount() {
        // If user isn't logged in then redirect to login page and don't do the requests
        if (!this.props.auth.isAuthenticated) {
            this.props.history.push('/login');
        } else {
            // Set the screen to loading
            this.props.setUserLoading();
            
            // Make first two requests
            axios.get('/api/users/userinfo')
                .then(firstRes => {
                    axios.get('/artifacts/' + firstRes.data._id)
                        .then(secondRes => {
                            axios.get('/api/users/profile/' + firstRes.data.email)
                                .then(thirdRes => {
                                    // Update state once with all 3 responses
                                    this.setState({
                                        email: firstRes.data.email,
                                        birthDate: firstRes.data.birthDate,
                                        publicName: firstRes.data.publicName,
                                        firstName: firstRes.data.firstName,
                                        lastName: firstRes.data.lastName,
                                        location: firstRes.data.location,
                                        dateCreated: new Date(firstRes.data.dateCreated).toDateString(),
                                        userID: firstRes.data._id,
                                        profileImgData: thirdRes.data,
                                        artifacts: secondRes.data
                                    });
                                    // After retrieving all of the data display the profile page
                                    this.props.setUserNotLoading();
                                })
                                .catch(err => {
                                    if (err.response.status === 404) {
                                        this.setState({
                                            email: firstRes.data.email,
                                            birthDate: firstRes.data.birthDate,
                                            publicName: firstRes.data.publicName,
                                            firstName: firstRes.data.firstName,
                                            lastName: firstRes.data.lastName,
                                            location: firstRes.data.location,
                                            dateCreated: new Date(firstRes.data.dateCreated).toDateString(),
                                            userID: firstRes.data._id,
                                            artifacts: secondRes.data
                                        });
                                        this.props.setUserNotLoading();
                                    }
                                });
                        })
                        .catch(err => {
                            if (err.response.status === 401) {
                                this.props.history.push('/login');
                                this.props.setUserNotLoading();
                            }
                        })

                })
                .catch(err => {
                    // Check the response err code for first request
                    if (err.response.status === 404) {
                        this.props.history.push('/404');
                        this.props.setUserNotLoading();
                    } else if (err.response.status === 401) {
                        this.props.history.push('/login');
                        this.props.setUserNotLoading();
                    }
                });
        }
    }

    artifactList() {
        return this.state.artifacts.map(function(currArtifact, i){
            return <Artifact artifacts={currArtifact} key={i} />;
        })
    }
    artifactBlockList() {
        return this.state.artifacts.map((currArtifact, i) => {
            return <ArtifactBlock artifactData={currArtifact} key={i} />;
        });
    }

    onTableViewToggle = () => {
        this.setState({
            tableView: !this.state.tableView
        });
    }

    // Save functions that run whenever the user saves an edit entry. This would POST to the backend to change values
    onSavePublicName(val) {
        this.setState({publicName: val});
        const newData = {
            publicName: val
        }
        axios.patch('/api/users/update', newData)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
    }

    onSaveFirstName(val) {
        this.setState({firstName: val});
        const newData = {
            firstName: val
        }
        console.log(newData.firstName);
        axios.patch('/api/users/update', newData)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
    }

    onSaveLastName(val) {
        this.setState({lastName: val});
        const newData = {
            lastName: val
        }
        axios.patch('/api/users/update', newData)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
    }

    onSaveEmail(val) {
        this.setState({email: val});
        const newData = {
            email: val
        }
        axios.patch('/api/users/update', newData)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
    }

    onSaveLocation(val) {
        this.setState({location: val});
        const newData = {
            location: val
        }
        axios.patch('/api/users/update', newData)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {

        if (this.props.auth.loading) {
            return (
                <Loading />
            )
        }

        var profileIMG;
        // Set a no profile image placeholder if there was no profile image
        if (this.state.profileImgData === "") {
            profileIMG = <img className ="profilePic" src={NO_IMG} alt='user profile pic'/>
        } else {
            profileIMG = <img className ="profilePic" src={`data:image/jpeg;base64,${this.state.profileImgData}`} alt='user profile pic'/>
        }

        // Different artifact table to view depending on user selection
        var artifactTable;
        if (this.state.tableView) {
            // Display table view
            artifactTable = 
                <table className="table table-striped justify-content-center" size="sm" >
                    <thead>
                    <tr>
                        <th className="tHeader">Name</th>
                        <th className="tHeader">Your Story</th>
                        <th className="tHeader">Date Made</th>
                        {/* Two blank ones for the edit and delete buttons */}
                        <th className="tHeader"></th>
                        <th className="tHeader"></th>
                    </tr>
                    </thead>
                    <tbody>
                    { this.artifactList() }
                    </tbody>
                </table>
        } else {
            // Block view by default
            artifactTable = this.artifactBlockList();
        }

        return(

            <div className="myProfile">
                {/* Change the header for the home menu */}
                <Helmet>
                    <title>My Profile</title>
                </Helmet>
                {/* Different navmenu bar to appear depending on whether it is viewed from a small or large screen */}
                <Container className="d-none d-lg-flex"><ProfileNavBar history={this.props.history}/></Container>
                <Container className="d-lg-none"><MobileMenu2 /></Container>
                <br /><br /><br />
                <br /><br /><br />
                <Container>
                    <Row>
                        <Col sm={{ size: 'auto', offset: 1}}>
                            <Container className="picBox">
                                {profileIMG}
                                <a href="/profile_image">Edit Picture</a>
                                <div className="d-flex justify-content-center">
                                </div>
                            </Container>
                        </Col>
                        <Col sm={{ size: '7', offset: 1.5 }}>
                            <Container className="profileBox">
                                <div className="d-flex justify-content-left input-group">
                                    <div className="d-flex justify-content-left input-group">
                                        <Row className="justify-content-left">
                                            <Col xs="auto" className="edit-text">
                                                {/* Buffer with spaces to make all field names the same length */}
                                                <div style={{borderRight: "2px solid grey", height: "30px", paddingRight: "12px"}}>Date Joined&nbsp;</div>
                                            </Col>
                                            <Col xs="auto" className="no-gutters">
                                                <p className="name edit-text">{this.state.dateCreated.slice(0,10)}</p>
                                            </Col>
                                        </Row>
                                    </div>
                                    <Row className="justify-content-left"> 
                                        <Col xs="auto" className="edit-text">
                                        {/* Buffer with spaces to make all field names the same length */}
                                            <div style={{borderRight: "2px solid grey", height: "30px", paddingRight: "3.5em"}}>Email&nbsp;</div>
                                        </Col>
                                        <Col xs="auto" className="no-gutters">
                                            <EdiText
                                                type='text'
                                                validation={val => val.length <= MAX_FIELD_LEN}
                                                validationMessage={"Please type less than " + MAX_FIELD_LEN + " characters."}
                                                viewContainerClassName='edit-text input-group'
                                                viewProps={{
                                                    style: {textAlign: "left", width: "380px", wordWrap: "break-word"}
                                                }}
                                                editButtonClassName='btn-sm btn-secondary'
                                                editButtonContent='Edit'
                                                saveButtonContent='Apply'
                                                saveButtonClassName='btn-sm btn-secondary'
                                                cancelButtonContent='Cancel'
                                                cancelButtonClassName='btn-sm btn-primary'
                                                inputProps={{
                                                    className: 'justify-content-left'
                                                }}
                                                value={this.state.email}
                                                onSave={this.onSaveEmail}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                <div className="d-flex justify-content-left input-group">
                                    <Row>
                                        <Col xs="auto" className="edit-text">
                                            <div style={{borderRight: "2px solid grey", height: "30px", paddingRight: "0.2em"}}>Public Name&nbsp;</div>
                                        </Col>
                                        <Col xs="auto">
                                        <EdiText
                                            type='text' 
                                            validation={val => val.length <= MAX_FIELD_LEN}
                                            validationMessage={"Please type less than " + MAX_FIELD_LEN + " characters."}
                                            viewContainerClassName='edit-text input-group'
                                            viewProps={{
                                                style: {textAlign: "left", width: "380px", wordWrap: "break-word"}
                                            }}
                                            editButtonClassName='btn-sm btn-secondary'
                                            editButtonContent='Edit'
                                            saveButtonContent='Apply'
                                            saveButtonClassName='btn-sm btn-secondary'
                                            cancelButtonContent='Cancel'
                                            cancelButtonClassName='btn-sm btn-primary'
                                            inputProps={{
                                                className: 'justify-content-left'
                                            }}
                                            value={this.state.publicName}
                                            onSave={this.onSavePublicName}
                                        />
                                        </Col>
                                    </Row>
                                </div>
                                <div className="d-flex justify-content-left input-group">
                                <Row className="justify-content-left"> 
                                    <Col xs="auto" className="edit-text">
                                    {/* Buffer with spaces to make all field names the same length */}
                                        <div style={{borderRight: "2px solid grey", height: "30px", paddingRight: "1em"}}>First Name&nbsp;</div>
                                    </Col>
                                    <Col xs="auto" className="no-gutters">
                                        <EdiText
                                            type='text'
                                            validation={val => val.length <= MAX_FIELD_LEN}
                                            validationMessage={"Please type less than " + MAX_FIELD_LEN + " characters."} 
                                            viewContainerClassName='edit-text input-group'
                                            viewProps={{
                                                style: {textAlign: "left", width: "380px", wordWrap: "break-word"}
                                            }}
                                            editButtonClassName='btn-sm btn-secondary'
                                            editButtonContent='Edit'
                                            saveButtonContent='Apply'
                                            saveButtonClassName='btn-sm btn-secondary'
                                            cancelButtonContent='Cancel'
                                            cancelButtonClassName='btn-sm btn-primary'
                                            inputProps={{
                                                className: 'justify-content-left'
                                            }}
                                            value={this.state.firstName}
                                            onSave={this.onSaveFirstName}
                                        />
                                    </Col>
                                </Row>
                                </div>
                                <div className="d-flex justify-content-left input-group">
                                <Row className="justify-content-left"> 
                                    <Col xs="auto" className="edit-text">
                                    {/* Pad to align everything to the longest field*/}
                                        <div style={{borderRight: "2px solid grey", height: "30px", paddingRight: "1em"}}>Last Name&nbsp;</div>
                                    </Col>
                                    <Col xs="auto" className="no-gutters">
                                        <EdiText
                                            type='text' 
                                            validation={val => val.length <= MAX_FIELD_LEN}
                                            validationMessage={"Please type less than " + MAX_FIELD_LEN + " characters."}
                                            viewContainerClassName='edit-text input-group'
                                            viewProps={{
                                                style: {textAlign: "left", width: "380px", wordWrap: "break-word"}
                                            }}
                                            editButtonClassName='btn-sm btn-secondary'
                                            editButtonContent='Edit'
                                            saveButtonContent='Apply'
                                            saveButtonClassName='btn-sm btn-secondary'
                                            cancelButtonContent='Cancel'
                                            cancelButtonClassName='btn-sm btn-primary'
                                            inputProps={{
                                                className: 'justify-content-left'
                                            }}
                                            value={this.state.lastName}
                                            onSave={this.onSaveLastName}
                                        />
                                    </Col>
                                </Row>
                                </div>

                                <div className="d-flex justify-content-left input-group">
                                <Row className="justify-content-left" style={{paddingBottom: "10px"}}> 
                                    <Col xs="auto" className="edit-text">
                                    {/* Buffer with spaces to make all field names the same length */}
                                        <div style={{borderRight: "2px solid grey", height: "30px", paddingRight: "2em"}}>Location&nbsp;</div>
                                    </Col>
                                    <Col xs="auto" className="no-gutters">
                                        <EdiText
                                            type='text' 
                                            validation={val => val.length <= MAX_FIELD_LEN}
                                            validationMessage={"Please type less than " + MAX_FIELD_LEN + " characters."}
                                            viewContainerClassName='edit-text input-group'
                                            viewProps={{
                                                style: {textAlign: "left", width: "380px", wordWrap: "break-word"}
                                            }}
                                            editButtonClassName='btn-sm btn-secondary'
                                            editButtonContent='Edit'
                                            saveButtonContent='Apply'
                                            saveButtonClassName='btn-sm btn-secondary'
                                            cancelButtonContent='Cancel'
                                            cancelButtonClassName='btn-sm btn-primary'
                                            inputProps={{
                                                className: 'justify-content-left'
                                            }}
                                            value={this.state.location}
                                            onSave={this.onSaveLocation}
                                        />
                                    </Col>
                                </Row>
                                </div>
                            </Container>
                            </Col>
                        <Col></Col>
                    </Row>
                </Container>
                <br></br><br></br>

                <Container className="artifactBox">
                    <p className="tMHeader">Your Artifacts</p>
                    <p className="tMHeader"><Button onClick={this.onTableViewToggle}>Toggle View between Table or List</Button></p>

                    {artifactTable}

                </Container>
            </div>
        )
    }
}

myProfile.propTypes = {
    auth: PropTypes.object.isRequired,
    setUserLoading: PropTypes.func.isRequired,
    setUserNotLoading: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { setUserLoading, setUserNotLoading }
)(myProfile);