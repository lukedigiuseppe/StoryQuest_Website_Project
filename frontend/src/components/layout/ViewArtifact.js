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

import ErrorAlert from '../alerts/ErrorAlert';

import '../../css/viewArtifact.css';
import axios from 'axios';


// Compononent that creates the regsitration page for new users.
// Need to add code that redirects to another page after pressing submit


const BANNER = "/images/cover.png";



const items = [
    {
      src: '/images/vase.jpg',
      altText: 'Slide 1',
      caption: 'Slide 1',
      header: 'Slide 1 Header'
    },
  ];

class ViewArtifact extends Component{



    constructor(props) {
        super(props);

    
        this.state = {
            name: "",
            story: "",
            category: "",
            dateMade: "" ,
            isPublic: "private",
            ownerID: ""
        }
    }

    componentDidMount() {
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
            })
            .catch(err => {
            
                console.log(err);
            });
    }

    // For posting form information, it gets a little more complicated. We will require two functions, onChange and onSubmit. 
    // onChange is the function that is run whenever there is a change in the input fields of the form. So we normally update the component state in this function.
    // onSubmit is the function tha

    render(){

        return(
            <div>
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
                <Row>
                    <Col xs = "6">
                        <h1 className="text-left" style={{paddingLeft: "30px"}}>{this.state.name}</h1>
                    </Col>
                

                    <Col xs = "6">
                        <p className="text-left" style={{paddingLeft: "30px"}}>User: {this.state.ownerID}</p>

                    </Col>
                </Row>
                <Row>   
                    <Col>
                
                         <h5 className="text-left" style={{paddingLeft: "30px"}}>Date: {this.state.dateMade}</h5>
                    </Col>

                </Row>

                <Row>
                    <h3 className="text-center">Story</h3>

                </Row>

                <Row>
                    <Col xs = "1"></Col>

                    <Col>
                    <p className="text-left" style={{paddingLeft: "30px"}}> {this.state.story}</p></Col>

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