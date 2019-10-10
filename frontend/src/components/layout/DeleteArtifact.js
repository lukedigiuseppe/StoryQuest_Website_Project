import React, {Component} from 'react';
import Helmet from 'react-helmet';
import {Link}  from 'react-router-dom';
//import PropTypes from "prop-types";
//import {registerUser} from '../../actions/authActions';
//import classnames from 'classnames';
import {
    Container,
    Col,
    Row,
    Button
} from 'reactstrap';


import '../../css/viewArtifact.css';
import axios from 'axios';




const BANNER = "/images/cover.png";


class DeleteArtifact extends Component{


    constructor(props) {
        super(props);
         /*Prepare the artifact information */
    
        this.state = {
            name: "",
        }

        this.yesClick = this.yesClick.bind(this);

    }

    /*If confirmed, delete the artifact and redirect to homepage*/
    yesClick()  {

        axios.delete('http://localhost:5000/delete_artifact/' + this.props.match.params.id);


        window.location = '/myprofile';
    }




    componentDidMount(){
        {/*Get the artifact name for display*/}
        axios.get('http://localhost:5000/artifact/' + this.props.match.params.id )
            .then(res => {
                console.log(res.data);
               
                this.setState({
                    name: res.data.name,
                })
            })


            .catch(err => {
            
                console.log(err);
            });


    }

    render(){

        return(
        <div>
            {/*Helmet*/}
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

                 {/*Back to home*/}
                 <Row>
                     <Col xs = "6">
                        <Link to="/" style={{paddingLeft: "40px", paddingTop: "10px", paddingBottom: "20px"}}>
                        <i className="far fa-arrow-alt-circle-left" style={{fontSize: "20px"}}> Back to Home</i>
                        </Link>
                    </Col>
                </Row>

                {/*As if they want to remove this*/}

                <Row>
                    <Col xs = "1"></Col>
                    <Col xs = "10">
                        <p  className= "text-center" style={{paddingLeft: "30px"}, {fontSize: "40px"}}>Are you sure you want to remove "{this.state.name}"?</p>
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


export default (DeleteArtifact);