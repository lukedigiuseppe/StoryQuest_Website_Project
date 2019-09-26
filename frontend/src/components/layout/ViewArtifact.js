import React, {Component} from 'react';
import Helmet from 'react-helmet';
import {Link, withRouter}  from 'react-router-dom';
import PropTypes from "prop-types";
import {connect} from 'react-redux';
import {registerUser} from '../../actions/authActions';
import classnames from 'classnames';
import {
    Container,
    Col,
    Row,
    Button, 
    Form, 
    FormGroup, 
    Label, 
    Input,
    InputGroup,
    InputGroupAddon,
    FormText, 
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption,
    UncontrolledCarousel 
} from 'reactstrap';

import ErrorAlert from '../alerts/ErrorAlert';

import '../../css/viewArtifact.css';

// Compononent that creates the regsitration page for new users.
// Need to add code that redirects to another page after pressing submit

const INPUTWIDTH = 10;
const DESCWIDTH = 2;
const BANNER = "/images/cover.png";

const PLACEHOLDER = "You Fav family heirloom";


const items = [
    {
      src: '/images/vase.jpg',
      altText: 'Slide 1',
      caption: 'Slide 1',
      header: 'Slide 1 Header'
    },
    {
        src: '/images/vase.jpg',      
        altText: 'Slide 2',
        caption: 'Slide 2',
        header: 'Slide 2 Header'
    },
    {
        src: '/images/vase.jpg',      
        altText: 'Slide 3',
        caption: 'Slide 3',
        header: 'Slide 3 Header'
    }
  ];

class ViewArtifact extends Component{

    render(){

        return(
            <div>
                <Helmet> 
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                    <title>View PLACEHOLDER</title>
                </Helmet>


                <Container className="justify-content-center" fluid>
                    <Row>
                        <img src={BANNER} alt="StoryQuest Banner" className="banner-image"/>
                    </Row>
                </Container>

                <Container className="register-box bg-light rounded-lg">

                 {/*Form title*/}
                 <Row>
                        <Link to="/" style={{paddingLeft: "40px", paddingTop: "10px", paddingBottom: "20px"}}>
                        <i className="far fa-arrow-alt-circle-left" style={{fontSize: "20px"}}> Back to Home</i>
                        </Link>
                </Row>
                    <h1 className="text-left" style={{paddingLeft: "30px"}}>Sick artifact</h1>
                <Row>   
                    <Col>
                
                         <h5 className="text-left" style={{paddingLeft: "30px"}}>Family Artifact since: 9000BC</h5>
                    </Col>

                </Row>

                <Row>
                    <h3 class="text-center">Story</h3>

                </Row>

                <Row>
                    <Col xs = "1"></Col>

                    <Col>
                    <p className="text-left" style={{paddingLeft: "30px"}}>Sing to me of the man, Muse, the man of twists and turns … driven time and again off course, once he had plundered the hallowed heights of Troy. Many cities of men he saw and learned their minds, many pains he suffered, heartsick on the open sea, fighting to save his life and bring his comrades home. But he could not save them from disaster, hard as he strove— the recklessness of their own ways destroyed them all, the blind fools, they devoured the cattle of the Sun and the Sungod blotted out the day of their return. Launch out on his story, Muse, daughter of Zeus, start from where you will—sing for our time too. By now, all the survivors, all who avoided headlong death were safe at home, escaped the wars and waves.></p>
                    </Col>

                    <Col xs = "1"></Col>

                </Row>

                <Row>



    
                    <Col sm={{ size: 6, order: 2, offset: 3 }}>
                        <UncontrolledCarousel items={items} autoPlay={false} />
                    </Col>

    

                </Row>

                <Row>
                    <h1 className="text-left" style={{paddingLeft: "30px"}}>TimeLine (we hope)</h1>
                </Row>
                <Row>
                    <Col xs="4"></Col>
                    <Col xs="4">
                        <UncontrolledCarousel items={items} />
                    </Col>
                    <Col xs="4"></Col>

                </Row>

                </Container>


            </div>
        )

    }


}



export default ViewArtifact;