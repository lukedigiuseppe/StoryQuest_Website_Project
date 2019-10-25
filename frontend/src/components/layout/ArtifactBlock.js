// This component renders a single block in the search results page that represents a single artifact

import React, {Component} from 'react';
import PropTypes from "prop-types";
import {Link} from 'react-router-dom';
import {Container, Row, Col, Button, Spinner} from 'reactstrap';
import axios from 'axios';

import '../../css/artifactBlock.css';

const NO_IMAGE = "/images/no-image-placeholder.png"

class ArtifactBlock extends Component {

    constructor(props) {
        super(props);

        this.state = {
            artifactName: this.props.artifactData.name,
            artifactStory: this.props.artifactData.story,
            artifactDate: new Date(this.props.artifactData.dateMade).toDateString(),
            artifactID: this.props.artifactData._id,
            // Get the first image of the artifact only to display for preview
            artifactMainIMG: this.props.artifactData.images[0],
            artifactIMG: NO_IMAGE
        }
    }

    componentDidMount () {
        if (this.state.artifactMainIMG) {
            axios.get('/artifact_images/' + this.state.artifactID + '/' + this.state.artifactMainIMG)
                .then(res => {
                    this.setState({
                        artifactIMG: `data:image/jpeg;base64,${res.data}`
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    componentDidUpdate(prevProps) {
        // Need to reset the state of the block whenever it receives new props from the artifactList component
        if (prevProps.artifactData !== this.props.artifactData) {
            this.setState((state, props) => {

                // Get the new image based on props instead of state as the update is not done yet
                if (props.artifactData.images[0]) {
                    axios.get('/artifact_images/' + props.artifactData._id + '/' + props.artifactData.images[0])
                        .then(res => {
                            this.setState({
                                artifactIMG: `data:image/jpeg;base64,${res.data}`
                            });
                        })
                        .catch(err => {
                            console.log(err);
                        })
                }

                // This will always be finished first so it sets the default state back to the original
                return {
                    artifactName: props.artifactData.name,
                    artifactStory: props.artifactData.story,
                    artifactDate: new Date(props.artifactData.dateMade).toDateString(),
                    artifactID: props.artifactData._id,
                    // Get the first image of the artifact only
                    artifactMainIMG: props.artifactData.images[0],
                    artifactIMG: NO_IMAGE
                }
            })
        }
    }

    render () {
        // Render a NO image placeholder if we still haven't got the artifact IMG or if it doesn't exist
        var artifactIMG;

        if (this.state.artifactIMG === NO_IMAGE) {
            artifactIMG = 
               <Col xs={3} className="image-box">
                    <Spinner className="loading-image"/>
                    <img style={{height: "100%",width: "100%"}} alt="" src={this.state.artifactIMG} />
                </Col> 
        } else {
            artifactIMG = 
                <Col xs={3}>
                    <img style={{height: "100%",width: "100%"}}alt="" src={this.state.artifactIMG} />
                </Col>
        }

        return (
            <Container className="artifact-container">
                <br />
                <Row noGutters>
                    {artifactIMG}

                    <Col xs={7} className="artifact-text text-left" style={{paddingLeft: "10px", paddingRight: "10px", paddingBottom: "10px", paddingTop: "10px"}}>
                        <h2>{this.state.artifactName}</h2>
                        <h3>{this.state.artifactDate}</h3>
                        {/* This bit of code cuts the story text if it exceeds 150 characters to make it fit nicer into the box */}
                        <p>{(this.state.artifactStory.length > 150) ? this.state.artifactStory.substring(0,150) + "..." : this.state.artifactStory}</p>
                    </Col>

                    <Col xs={2} className="artifact-link-box">
                        <div>
                            <Link to={'/view_artifact/' + this.state.artifactID}><Button>View Artifact</Button></Link>
                        </div>
                    </Col>
                </Row>
                <br />
            </Container>
        )
    }
}

ArtifactBlock.propTypes = {
    artifactData: PropTypes.object.isRequired
}

export default ArtifactBlock;