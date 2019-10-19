import React, {Component} from 'react';
import {Container, Row} from 'reactstrap';
import TopMenu from './TopMenu'
import MobileMenu from './MobileMenu';
import {Helmet} from "react-helmet";
import axios from 'axios';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

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
            profileImage: "",
            artifacts: [],
            
    
        }
    }

    componentDidMount() {

        /*Get user info from backend database*/
      
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
            })

            /*get and deal with prifile image for dsiplay*/
        axios.get("http://localhost:5000/api/users/profile/" + this.props.auth.user.email)
        .then(res => {
            // We then call setState here to assign the information we got back into our state so that we can render it.
            this.setState({
                profileImage: res.data,
            })
        })


        axios.get('/artifacts/' + this.props.match.params.id)
            .then(res =>{

                this.setState({
                    artifacts: res.data
                })
            })

            .catch(err => {
                console.log(err);
            });

        
  
    }

    artifactList() {
        return this.state.artifacts.map(function(currArtifact, i){
            return <Artifact artifacts={currArtifact} key={i} />;
        })
    }

    onChange = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    }

    render() {
        return(
            <div className="profile">
                {/* Change the header for the home menu */}
                <Helmet>
                    <title>Profile of {this.props.auth.user.name}</title>
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
                <div>
                    <div className="d-flex justify-content-centre"> <p className="tMHeader">Your Artifacts</p></div>
                    <table className="table table-striped" size="sm" >
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

Profile.propTypes = {
    auth: PropTypes.object.isRequired
};


const mapStateToProps = state => ({
    auth: state.auth
});



export default connect(mapStateToProps)(Profile);