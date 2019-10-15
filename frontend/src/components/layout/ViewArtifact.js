import React, {Component} from 'react';
import Helmet from 'react-helmet';
import {Link}  from 'react-router-dom';
import PropTypes from "prop-types";
import {connect} from 'react-redux';
import Loading from './Loading';
import {setUserLoading, setUserNotLoading} from '../../actions/authActions';

import {
    Container,
    Col,
    Row,
    UncontrolledCarousel 
} from 'reactstrap';


import '../../css/viewArtifact.css';
import axios from 'axios';


const BANNER = "/images/cover.png";

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
        }
    }

    componentDidMount() {

        this.props.setUserLoading();

         /*Get the artifact information from backend using axios */
        axios.get('http://localhost:5000/artifact/' + this.props.match.params.id )
            .then(res => {
                console.log(res.data);
                // We then call setState here to assign the information we got back into our state so that we can render it.
                this.setState({
                    name: res.data.name,
                    story: res.data.story,
                    category: res.data.category,
                    dateMade: res.data.dateMade,
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
                    });
            })
            .catch(err => {
                console.log(err);
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
                    });
            });
        })
        .catch(err => {
            console.log(err);
        });
    }
    
    render(){

        if (this.props.auth.loading) {
            return (
                <Loading />
            )
        }

        // If there are no images don't display the carousel by default
        var carouselComp = <Row></Row>

        if (this.state.images.length !== 0) {
            carouselComp = 
                <Row>
                    <Col sm={{ size: 6, order: 2, offset: 3 }}>
                        <UncontrolledCarousel items={this.state.images} autoPlay={false} />
                    </Col>
                </Row>
        }

        return(
            <div>

                {/*Hemet*/}
                <Helmet> 
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                    <title>{this.state.name}</title>
                </Helmet>


                <Container className="justify-content-center" fluid>
                    <Row>
                        <img src={BANNER} alt="StoryQuest Banner" className="banner-image"/>
                    </Row>
                </Container>

                <Container className="register-box bg-light rounded-lg">

                 {/*Form title*/}
                 <Row>
                     <Col xs = "6">
                        <Link to="/" style={{paddingLeft: "40px", paddingTop: "10px", paddingBottom: "20px"}}>
                        <i className="far fa-arrow-alt-circle-left" style={{fontSize: "20px"}}> Back to Home</i>
                        </Link>
                    </Col>

                    
                </Row>

                {/*Item name*/}
                <Row>
                    <Col xs = "6">
                        <h1 className="text-left" style={{paddingLeft: "30px"}}>{this.state.name}</h1>
                    </Col>
                

                    
                </Row>

                {/*Item date*/}
                <Row>   
                    <Col xs = "2">
                
                         <h5 className="text-left" style={{paddingLeft: "30px"}}>Date: {this.state.dateMade.slice(0, 10)}</h5>
                    </Col>

                    <Col xs = "8" ></Col>

                    <Col xs = "2">

                        <Link to={"/profile/"  + this.state.ownerID} style={{fontSize: "20px"}}> User: {this.state.ownerName}
                        </Link>

                    </Col>

                </Row>

                {/*Item story*/}
                <Row>
                     <Col xs = "1"></Col>
                    <Col xs = "10">
                    <p  className= "text-center" style={{fontSize: "30px"}}>Story</p>
                    </Col>

                    <Col xs = "1"></Col>

                </Row>

                <Row>
                    <Col xs = "1"></Col>

                    <Col xs = "10">
                    <p className="text-center" > {this.state.story}</p></Col>

                    <Col xs = "1"></Col>
                </Row>


                {/*Item images*/}
                {carouselComp}
                
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