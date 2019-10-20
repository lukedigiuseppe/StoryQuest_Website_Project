import React, {Component} from 'react';
import Helmet from 'react-helmet';
import {Link}  from 'react-router-dom';
import PropTypes from "prop-types";
import {connect} from 'react-redux';
import Loading from './Loading';
import {setUserLoading, setUserNotLoading} from '../../actions/authActions';
import ReactPlayer from 'react-player';
import ProfileNavBar from './profileNavBar';
import TopMenu from './TopMenu';

import {
    Container,
    Col,
    Row,
    UncontrolledCarousel ,
    Button
} from 'reactstrap';


import '../../css/viewArtifact.css';
import axios from 'axios';

const encrypt = require('../../utils/encryption').encrypt;

const NO_IMG = "/images/no-image-placeholder.png";
const NO_VID = "/images/no-video-placeholder.jpg";


class ViewArtifact extends Component{

    constructor(props) {
        super(props);
             
        /*Prepare the artifact information */
    
        this.state = {
            name: "",
            story: "",
            category: "",
            dateMade: "" ,
            isPublic: "private",
            ownerID: "",
            images: [],

            ownerName: "",

            iv: "",
            enc: "",
            videoSRC: "",
        }
    }

    componentDidMount() {

        this.props.setUserLoading();

         /*Get the artifact information from backend using axios */
        axios.get('http://localhost:5000/artifact/' + this.props.match.params.id )
            .then(res => {
                // We then call setState here to assign the information we got back into our state so that we can render it.
                this.setState({
                    name: res.data.name,
                    story: res.data.story,
                    category: res.data.category,
                    dateMade: new Date(res.data.dateMade).toDateString(),
                    isPublic: res.data.isPublic,
                    ownerID: res.data.ownerID,
                })

                /*Get the owner ID from backend, so name can be displayed*/
                axios.get('http://localhost:5000/api/users/profile/all_info/' + this.state.ownerID )
                    .then(res => {
                            console.log(res.data);
                            this.setState({
                                ownerName: res.data.publicName,
                            })
                        })
                    .catch(err => {
                        console.log(err);
                        if (err.response.status === 404) {
                            this.props.history.push('/404');
                        }
                        this.props.setUserNotLoading();
                    });
            })
            .catch(err => {
                console.log(err);
                if (err.response.status === 404) {
                    this.props.history.push('/404');
                }
                this.props.setUserNotLoading();
            });

        axios.get("/artifact/" + this.props.match.params.id)
            .then(res => {
                // Just get the first video of every artifact as long as it has a video
                if (typeof(res.data.videos) !== 'undefined' && res.data.videos.length > 0) {
                    const data = encrypt(res.data.videos[0]);
                    this.setState({
                        iv: data.iv,
                        enc: data.encryptedData,
                        videoSRC: "/video/" + data.iv + "/" + data.encryptedData
                    });
                }
            });

        /*Get, process and package the images so reactstrap can display them */
        axios.get('/artifact/' + this.props.match.params.id)
        .then(res => {

            // If we don't have images set to not load anymore
            if (res.data.images.length === 0) {
                this.props.setUserNotLoading();
            }

            // Set a counter to check when all images have been retrieved
            var counter = 0;
            res.data.images.forEach((imageID, index, imageArr)=> {
                axios.get('/artifact_images/' + this.props.match.params.id + '/' + imageID)
                    .then(res => {
                        this.setState(prevState => ({
                                images: [
                                    ...prevState.images, 
                                    {
                                        src: `data:image/jpeg;base64,${res.data}`, 
                                        altText: "",
                                        caption: "",
                                        header: ""
                                    }
                                ]
                            }));
                        counter++;
                        if (counter === imageArr.length) {
                            // We have finished loading all images so display the page
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
            });
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

        // If there are no images don't display the carousel by default
        var carouselComp = 
            <Row>
                <Col style={{textAlign: "center"}} sm={{ size: 6, order: 2, offset: 3 }}>
                    <img alt="" src={NO_IMG} style={{ height: "250px", width: "250px"}}/>
                    <br /><br />
                    <h2 className="text-center">No Images found.</h2>
                </Col>
            </Row>

        if (this.state.images.length !== 0) {
            carouselComp = 
                <Row >
                    <Col sm={{ size: 6, order: 2, offset: 3 }}>
                        <UncontrolledCarousel items={this.state.images} autoPlay={false} />
                    </Col>
                </Row>
        }

        const {videoSRC} = this.state;

        let videoPlayer;

        if (videoSRC === "") {
            // Display message saying there is no video
            videoPlayer = 
            <Row>
                <Col style={{textAlign: "center"}} sm={{ size: 6, order: 2, offset: 3 }}>
                    <img alt="" src={NO_VID} style={{ height: "250px", width: "250px"}}/>
                    <br /><br />
                    <h2 className="text-center">No video for this artifact.</h2>
                </Col>
            </Row>
        } else {
            videoPlayer =  
            <Row>
                <Col sm={{ size: 6, order: 2, offset: 3 }}>
                    <ReactPlayer 
                        url={videoSRC} 
                        config={{
                            file: {
                                attributes: {
                                    autoPlay: true,
                                    preload: "metadata"
                                }
                            }
                        }}
                        width='100%' 
                        height='100%' 
                        controls 
                        loop
                        onError={e => this.props.history.push('/video/' + this.props.match.params.id)}
                    />
                </Col>
            </Row>
        }

        const navMenu = this.props.auth.isAuthenticated ? <Container className="d-none d-lg-flex"><ProfileNavBar history={this.props.history}/></Container> : <Container className="d-none d-lg-flex"><TopMenu /></Container>;

        return(
            <div>

                {/*Hemet*/}
                <Helmet> 
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                    <title>{this.state.name}</title>
                </Helmet>

                {navMenu}

                <Container className="artifact-box bg-light rounded-lg">

                {/*Back to previous page*/}
                <Row>
                    <Col xs = "6">
                        <Button onClick={this.props.history.goBack} style={{marginLeft: "40px", marginTop: "10px", marginBottom: "20px"}} color="primary">
                            <i className="far fa-arrow-alt-circle-left" style={{fontSize: "20px"}}> Go Back</i>
                        </Button>
                    </Col>
                </Row>

                <br />

                {/*Item name*/}
                <Row>
                    <Col xs = "6">
                        <h1 className="text-left" style={{paddingLeft: "30px"}}>{this.state.name}</h1>
                    </Col>
                </Row>

                <br />

                {/*Item date*/}
                <Row>   
                    <Col xs = "4" className="text-left">
                         <h5 style={{paddingLeft: "30px"}}>Date: {this.state.dateMade}</h5>
                    </Col>

                    <Col xs = "4" ></Col>

                    <Col xs = "4" className="text-right">
                        <h5 style={{fontSize: "20px", paddingRight: "30px"}}>User: <Link to={"/profile/"  + this.state.ownerID} >{this.state.ownerName}</Link></h5>
                    </Col>

                </Row>

                <br />

                {/*Item story*/}
                <Row>
                     <Col xs = "1"></Col>
                    <Col xs = "10">
                        <h1 className= "text-center">Story</h1>
                    </Col>

                    <Col xs = "1"></Col>

                </Row>

                <Row>
                    <Col xs = "1"></Col>

                    <Col xs = "10">
                    <p className="text-center" > {this.state.story}</p></Col>

                    <Col xs = "1"></Col>
                </Row>

                <br />

                {/*Item images*/}
                <Row>
                    <Col xs = "1"></Col>
                    <Col xs = "10">
                    <h1  className= "text-center">Images</h1>
                    </Col>

                    <Col xs = "1"></Col>

                </Row>
                {carouselComp}

                <br /><br /><br />

                {/* Videos */}
                <Row>
                    <Col xs = "1"></Col>
                    <Col xs = "10">
                    <h1 className= "text-center">Video</h1>
                    </Col>

                    <Col xs = "1"></Col>

                </Row>
                {videoPlayer}

                </Container>
            </div>
        )

    }
}

ViewArtifact.propTypes = {
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
)(ViewArtifact);