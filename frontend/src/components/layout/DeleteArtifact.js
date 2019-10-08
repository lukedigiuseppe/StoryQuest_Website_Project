import React, {Component} from 'react';
import Helmet from 'react-helmet';

import {Link, withRouter}  from 'react-router-dom';
//import PropTypes from "prop-types";
//import {connect} from 'react-redux';
//import {registerUser} from '../../actions/authActions';
//import classnames from 'classnames';
import {
    Container,
    Col,
    Row,
    UncontrolledCarousel 
} from 'reactstrap';


import '../../css/viewArtifact.css';
import axios from 'axios';


// Compononent that creates the regsitration page for new users.
// Need to add code that redirects to another page after pressing submit


const BANNER = "/images/cover.png";


class DeleteArtifact extends Component{

    render(){

        return(
        <div>
            <Helmet> 
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                    <title>Delete?</title>
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

                <Row>
                    <Col xs = "1"></Col>
                    <Col xs = "10">
                        <p  className= "text-center" style={{paddingLeft: "30px"}, {fontSize: "40px"}}>Are you sure you want to remove _____</p>
                    </Col>
                    <Col xs = "1"></Col>
                </Row>
                <Row>
                    <Col xs = "1"></Col>
                    <Col xs = "10">
                        <p  className= "text-center" style={{paddingLeft: "30px"}, {fontSize: "30px"}}>This will be perminent.</p>
                    </Col>
                    <Col xs = "1"></Col>
                </Row>



                
                </Container>
        </div>
        )
    }



}

export default DeleteArtifact;