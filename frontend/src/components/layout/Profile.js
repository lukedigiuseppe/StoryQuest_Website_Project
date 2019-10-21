import React, {Component} from 'react';
import {Container, Row, Button} from 'reactstrap';
import TopMenu from './TopMenu'
import MobileMenu from './MobileMenu';
import {Helmet} from "react-helmet";
import axios from 'axios';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ArtifactBlock from './ArtifactBlock';
import Loading from './Loading';
import { setUserLoading, setUserNotLoading } from "../../actions/authActions";

import '../../css/profile.css';

const Artifact = props => (
    <tr>
        <td>
            <Link to={"/view_artifact/"+props.artifacts._id}>{props.artifacts.name}</Link>
        </td>
        <td>{props.artifacts.story.substring(0,25)} ...</td>
        <td>{new Date(props.artifacts.dateMade).toDateString()} </td>
    </tr>
)

const NO_IMG = '/images/no-image-placeholder.png';

class Profile extends Component {
   
    constructor(props) {
        super(props);

        /*States for user info*/
        this.state = {
            publicName: "",
            firstName: "",
            lastName: "",
            location:"",
            dateCreated: "",
            profileImage: NO_IMG,
            artifacts: [],
            tableView: false
            
        }
    }

    componentDidMount() {

        /*Get user info from backend database*/
        this.props.setUserLoading();
      
        axios.get("http://localhost:5000/api/users/profile/all_info/" + this.props.match.params.id)
            .then(res => {
                // We then call setState here to assign the information we got back into our state so that we can render it.
                this.setState({
                    publicName: res.data.publicName,
                    firstName: res.data.firstName,
                    lastName: res.data.lastName,
                    location: res.data.location,
                    dateCreated: res.data.dateCreated,
                })
                // get and deal with profile image for display
                axios.get("http://localhost:5000/api/users/profile/" + res.data.email)
                .then(res => {
                    // We then call setState here to assign the information we got back into our state so that we can render it.
                    this.setState({
                        profileImage: res.data,
                    })
                    axios.get('/artifacts/' + this.props.match.params.id)
                        .then(res =>{
                            this.setState({
                                artifacts: res.data
                            })
                            this.props.setUserNotLoading();
                        })
                        .catch(err => {
                            console.log(err);
                            this.props.setUserNotLoading();
                        });
                })
                .catch(err => {
                    if (err.response.status === 404) {
                        console.log("No profile image found.");
                        axios.get('/artifacts/' + this.props.match.params.id)
                            .then(res =>{
                                this.setState({
                                    artifacts: res.data
                                })
                                this.props.setUserNotLoading();
                            })
                            .catch(err => {
                                console.log(err);
                                this.props.setUserNotLoading();
                            });
                    }
                    this.props.setUserNotLoading();
                });
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
            })
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

    onChange = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    }

    render() {

        if (this.props.auth.loading) {
            return <Loading />
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
            <div className="profile">
                {/* Change the header for the home menu */}
                <Helmet>
                    <title>Profile of {this.state.publicName}</title>
                </Helmet>
                {/* Different navmenu bar to appear depending on whether it is viewed from a small or large screen */}
                    <Container className="d-none d-lg-flex"><TopMenu /></Container>
                    <Container className="d-lg-none"><MobileMenu /></Container>
                <br /><br /><br />

                <Container className="profileBox">
                            <img className ="profilePic" src= {`data:image/jpeg;base64,${this.state.profileImage}`} alt='user profile pic'/>
                            <div className="d-flex justify-content-center">
                                <p className="name">{this.state.publicName}</p>
                            </div>


                <div className="d-flex justify-content-center"><img className ="icon" src='/images/locationpin.png' alt='location icon'/>Location: {this.state.location}</div>
                    <div className="d-flex justify-content-center"><img className ="icon" src='/images/tick.png' alt='date joined icon'/>Joined: {this.state.dateCreated.slice(0,10)}</div>
                    <Row></Row>
                    <Row></Row>
                    <Row></Row>

                    <br></br><br></br>
                    <br></br><br></br>
                </Container>
                <br></br><br></br>

                <Container className="artifactBox"> 
                    <p className="tMHeader">{this.state.publicName}'s Artifacts</p>
                    <p className="tMHeader"><Button onClick={this.onTableViewToggle}>Toggle View between Table or List</Button></p>
                    {artifactTable}
                </Container>
            </div>
        )
    }
}

Profile.propTypes = {
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
)(Profile);