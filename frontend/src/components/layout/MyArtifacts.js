// This component lists all the artifacts a person has made

import React, {Component} from 'react';
import Helmet from 'react-helmet';
import Loading from './Loading';
import {setUserLoading, setUserNotLoading} from '../../actions/authActions';
import PropTypes from "prop-types";
import {connect} from 'react-redux';
import {Container, Row, Col, Button} from 'reactstrap';
import {Link} from 'react-router-dom';
import axios from 'axios';

import ProfileNavBar from './profileNavBar';
import TopMenu from './TopMenu';
import ArtifactBlock from './ArtifactBlock';

import '../../css/artifactList.css';

const decrypt = require('../../utils/encryption').decrypt;

class ArtifactsList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            artifacts: []
        }
    }

    componentDidMount () {
        // If user is not logged in redirect to login page
        if (!this.props.auth.isAuthenticated) {
            this.props.history.push('/login');
        }

        this.props.setUserLoading();
        // Get all of the artifacts from the user but first decrypt the user ID stored in the redux store
        const userID = decrypt(this.props.auth.user.id);
        axios.get('/artifacts/' + userID)
            .then (res => {
                this.setState({
                    artifacts: res.data
                });
                this.props.setUserNotLoading();
            })
            .catch(err => {
                console.log(err);
                this.props.setUserNotLoading();
            });
    }

    artifactBlockList() {
        return this.state.artifacts.map((currArtifact, i) => {
            return <ArtifactBlock artifactData={currArtifact} key={i} />;
        });
    }

    render () {

        // Render the loading screen only if we are still waiting on data from the backend
        if (this.props.auth.loading) {
            return (
                <Loading />
            )
        }

        var navMenu = undefined;

        if (this.props.auth.isAuthenticated) {
            navMenu = <ProfileNavBar history={this.props.history} />
        } else {
            navMenu = <TopMenu />
        }


        // If there isn't any artifacts returned display this
        var noArtifacts;

        if (this.state.artifacts.length === 0) {
            noArtifacts =
            <Container>
                <Row>
                    <Col>
                    <h2 style={{textAlign: "left"}}>No artifacts found</h2>
                    <br />
                    <h3 style={{textAlign: "left"}}>
                        How about creating your very first artifact. Just click the button below
                    </h3>
                    <p style={{textAlign: "left"}}>
                        <Link to='/add_artifact'><Button>Create a new artifact</Button></Link>
                    </p>
                    </Col>
                </Row>
            </Container>
        }

        return (
            <div className="main-container">
                {/*Allows us to edit the header within a React component*/}
                <Helmet> 
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                    <title>List of My Artifacts</title>
                </Helmet>
                {navMenu}
                <Container className="result-box">
                    <Container>
                            <Row>
                                <Col>
                                <h1 style={{textAlign: "left"}}>List of My Artifacts</h1>
                                <br />
                                </Col>
                            </Row>
                    </Container>
                    {this.artifactBlockList()}
                    {noArtifacts}
                </Container>
            </div>
        )
    }
}

ArtifactsList.propTypes = {
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
)(ArtifactsList);
