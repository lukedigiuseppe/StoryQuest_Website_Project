// This component renders a list of artifacts each with a single picture and short description of the artifact. For use with search results

import React, {Component} from 'react';
import Helmet from 'react-helmet';
import Loading from './Loading';
import {setUserLoading, setUserNotLoading} from '../../actions/authActions';
import PropTypes from "prop-types";
import {connect} from 'react-redux';
import {Container, Row, Col, Button, Form, Input} from 'reactstrap';
import axios from 'axios';

import ProfileNavBar from './profileNavBar';
import TopMenu from './TopMenu';
import ArtifactBlock from './ArtifactBlock';

import '../../css/artifactList.css';

class ArtifactsList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searchString: this.props.match.params.searchString,
            searched: "",
            artifacts: []
        }
    }

    componentDidMount () {
        // If a searchstring was passed in the URL get the corresponding artifacts back as the component mounts.
        if (this.state.searchString) {
            this.props.setUserLoading();
            var data = {searchString: this.state.searchString};
            this.state.searched = this.state.searchString;
            axios.post('http://localhost:5000/searchartifacts', data)
                .then((res) => {
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
    }

    onChange = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    }

    onSubmit = (e) => {
        e.preventDefault()
        var data = {searchString: this.state.searchString};
        this.state.searched = this.state.searchString;
        axios.post('http://localhost:5000/searchartifacts', data)
            .then((res) => {
                this.setState({
                    artifacts: res.data
                });
            })
            .catch(err => {
                console.log(err);
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


        // If there isn't any artifacts returned by the search page display this
        var noResults;

        if (this.state.artifacts.length === 0) {
            noResults =
            <Container>
                <Row>
                    <Col>
                    <h2 style={{textAlign: "left"}}>No results for "{this.state.searched}".</h2>
                    <br />
                    <p style={{textAlign: "left"}}>
                        Try these search tips:
                    </p>
                    <ul style={{textAlign: "left"}}>
                        <li>Double check your spelling</li>
                        <li>Try a less specific keyword</li>
                        <li>Put spaces between words</li>
                    </ul>
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
                    <title>List of Artifacts</title>
                </Helmet>
                {navMenu}
                <Container className="search-bar">
                    <Row>
                        {/* Create two columns, one to hold the search bar and the other for the button */}
                        <Col sm={{size: 10}}>
                            <Form onSubmit={this.onSubmit}>
                                <Input type="search"
                                    id="searchString"
                                    className="mr-2"
                                    onChange={this.onChange}
                                    value={this.state.searchString}
                                    placeholder="Enter a keyword"/>
                            </Form>
                        </Col>
                        <Col>
                            <Form>
                                <Button onClick={this.onSubmit}>Search</Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
                <Container className="result-box">
                    <Container>
                            <Row>
                                <Col>
                                <h1 style={{textAlign: "left"}}>Search Results</h1>
                                <br />
                                </Col>
                            </Row>
                    </Container>
                    {this.artifactBlockList()}
                    {noResults}
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

