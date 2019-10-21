import React, {Component} from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import PropTypes from "prop-types";
import Loading from './Loading';
import { setUserLoading, setUserNotLoading } from "../../actions/authActions";
import {
    Container,
    Col,
    Row,
    Button
} from 'reactstrap';


import '../../css/deleteArtifact.css';
import axios from 'axios';

const BANNER = "/images/cover.png";
const NO_IMAGE = "/images/no-image-placeholder.png";


class DeleteArtifact extends Component{


    constructor(props) {
        super(props);
         /*Prepare the artifact information */
    
        this.state = {
            name: "",
            mainIMG: NO_IMAGE
        }

        this.yesClick = this.yesClick.bind(this);

    }

    /*If confirmed, delete the artifact and redirect to homepage*/
    yesClick() {
        // Set to loading
        this.props.setUserLoading();

        axios.delete('http://localhost:5000/delete_artifact/' + this.props.match.params.id)
            .then(res => {
                this.props.setUserNotLoading();
                this.props.history.push('/myprofile');
            })
            .catch(err => {
                console.log(err);
                if (err.response.status === 404) {
                    this.props.history.push('/404');
                }
                this.props.setUserNotLoading();
            });
    }

    componentDidMount(){
        this.props.setUserLoading();
        // Get the artifact name for display
        axios.get('http://localhost:5000/artifact/' + this.props.match.params.id )
            .then(res => {
                console.log(res.data);
                this.setState({
                    name: res.data.name
                });
                // If there is an image
                if(res.data.images[0]) {
                    axios.get('/artifact_images/' + this.props.match.params.id + '/' + res.data.images[0])
                        .then(res => {
                            this.setState({
                                mainIMG: `data:image/jpeg;base64,${res.data}`
                            });
                            this.props.setUserNotLoading();
                        })
                        .catch(err => {
                            console.log(err);
                            this.props.setUserNotLoading();
                        })
                } else {
                    this.props.setUserNotLoading();
                }
            })
            .catch(err => {
                console.log(err);
                if (err.response.status === 404) {
                    this.props.history.push('/404');
                }
                this.props.setUserNotLoading();
            });
    }

    render(){

        if (this.props.auth.loading) {
            return (
                <Loading />
            )
        }

        // Render a loading image if we still haven't got the artifact IMG
        var artifactIMG;

        if (this.state.mainIMG === NO_IMAGE) {
            artifactIMG =
                <Col xs={3} className="image-box">
                    <img style={{height: "100%",width: "100%"}} alt="" src={this.state.mainIMG} />
                </Col>
        } else {
            artifactIMG =
                <Col xs={3}>
                    <img style={{height: "80%", width: "100%"}}alt="" src={this.state.mainIMG} />
                </Col>
        }

        return(
        <div>
            {/*Helmet*/}
            <Helmet> 
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <title>Delete?</title>
            </Helmet>

            <Container className="delete-box bg-light rounded-lg">

                {/*Back to previous page*/}
                <Row>
                    <Col xs = "6">
                        <Button onClick={this.props.history.goBack} style={{marginLeft: "40px", marginTop: "10px", marginBottom: "20px"}} color="primary">
                            <i className="far fa-arrow-alt-circle-left" style={{fontSize: "20px"}}> Go Back</i>
                        </Button>
                    </Col>
                </Row>

                <Row>
                    <img src={BANNER} alt="StoryQuest Banner" className="banner-image"/>
                </Row>

                {/* Artifact image */}

                <Row className="justify-content-center">
                    {artifactIMG}
                </Row>

                {/*As if they want to remove this*/}

                <Row>
                    <Col xs = "1"></Col>
                    <Col xs = "10">
                        <p  className= "text-center" style={{paddingLeft: "30px", fontSize: "40px"}}>Are you sure you want to remove "{this.state.name}"?</p>
                    </Col>
                    <Col xs = "1"></Col>
                </Row>
                <Row>
                    <Col xs = "1"></Col>
                    <Col xs = "10">
                        <p  className= "text-center" style={{paddingLeft: "30px", fontSize: "30px"}}>This will be permanent.</p>
                    </Col>
                    <Col xs = "1"></Col>
                </Row>

                {/*Buttons to say yes or no to the deletion*/}
                <Row>
                    <Col xs = "4"></Col>

                    <Col xs = "2">
                        <Button onClick = {this.yesClick}size ="lg" block> Yes</Button>
                    </Col>

                    <Col xs = "2">
                        <Button href= {"/view_artifact/" + this.props.match.params.id} size ="lg" block> No </Button>

                    </Col>


                    <Col xs = "4"></Col>
                </Row>
            </Container>
        </div>
        )
    }



}


DeleteArtifact.propTypes = {
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
)(DeleteArtifact);