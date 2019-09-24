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
    Card, 
    CardImg, 
    CardText, 
    CardBody,
    CardTitle,
    CardSubtitle,
} from 'reactstrap';

import ErrorAlert from '../alerts/ErrorAlert';

import '../../css/addArtifact.css';

// Compononent that creates the regsitration page for new users.
// Need to add code that redirects to another page after pressing submit

const INPUTWIDTH = 10;
const DESCWIDTH = 2;
const BANNER = "/images/cover.png"
const MARGIN = 1;
const HALF = 6;


class AddArtifact extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            catagory: "",
            date: "",
            story: "",
            keywords: {},
            errors: {},
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.errors !== prevProps.errors) {
            this.setState({
                errors: this.props.errors
            });
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    };
    
    onKeywordButtonClick(input){
   
    }

    onSubmit = (e) => {
        e.preventDefault();
        
        // Send the entire state including confirmation fields so that it can be validated on at the backend
        const newArtifact = {
            name: this.state.name,
            catagory: this.state.catagory,
            date: this.state.date,
            story: this.state.story,
            confirmEmail: this.state.confirmEmail,
            keywords: this.state.keywords,
        };
        
        // Register the user by using the passed in registerUser action from redux
        this.props.registerArtifact(newArtifact, this.props.history);
    };


    render(){
        const { errors } = this.state;

        return(
            <div>
                {/*Title*/}
                <Helmet> 
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                    <title>Register an artifact</title>
                </Helmet>


                {/*Banner*/}

                <Container className="justify-content-center" fluid>
                    <Row>
                        <img src={BANNER} alt="StoryQuest Banner" className="banner-image"/>
                    </Row>
                </Container>

                <Container className="register-box bg-light rounded-lg">

              
                <Row>
                        <Link to="/" style={{paddingLeft: "40px", paddingTop: "10px", paddingBottom: "20px"}}>
                        <i className="far fa-arrow-alt-circle-left" style={{fontSize: "20px"}}> Back to Home</i>
                        </Link>
                </Row>
            

                <Form noValidate className="register-form" onSubmit={this.onSubmit}>

                    <Row>
                        <Col sm = {MARGIN}></Col>
                        <Col>
                        <h2 className="text-left" >Add a new artifact</h2>
                        </Col>
                        <Col sm = {MARGIN}></Col>
                    </Row>

                    <FormGroup row>

                        <Col sm = {MARGIN}></Col>

                        <Col sm={HALF -1}>
                            <Input
                                onChange={this.onChange}
                                value={this.state.name}
                                error={errors.Name} 
                                type="text" 
                                id="name" 
                                placeholder="What's your artifact called?" 
                            />
                            <ErrorAlert errorMsg={errors.Name} />
                        </Col>

                        <Col sm = {HALF -1}></Col>

                        <Col sm = {MARGIN}></Col>
                    </FormGroup>

                    <Row>
                        <Col sm = {MARGIN}></Col>
                        <Col>
                        <h2 className="text-left" >Its Story</h2>
                        </Col>
                        <Col sm = {MARGIN}></Col>
                    </Row>

                    <FormGroup row>
    
                        <Col sm = {MARGIN}></Col>
                        <Col>
                            <Input 
                                style = {{height: '200px'}}
                                onChange={this.onChange}
                                value={this.state.story}
                                type="textarea" 
                                name="text" 
                                id="story" 
                                placeholder= "Tell us about its journey"
                                />
                                <ErrorAlert errorMsg={errors.Story} />

                        </Col>  

                        <Col sm = {MARGIN}></Col>
                    </FormGroup>



                    <Row>
                        <Col sm = {MARGIN}></Col>
                        <Col>
                        <h2 className="text-left" >Add Photos</h2>
                        </Col>
                        <Col sm = {MARGIN}></Col>
                    </Row>

                    <FormGroup row>
                        <Col sm = {MARGIN}></Col>
                
                        <Col sm = {3}>
                        <Card>

                        <CardImg top width = "100%" src= '/images/vase.jpg' ></CardImg>

                        <CardBody>
                            <CardTitle>Upload Image</CardTitle>
                            <Input 
                            style = {{height: '100px'}}
                            type="file" 
                            name="file" 
                            id="exampleFile" />
                        </CardBody>
                        </Card>


                        </Col>

                        <Col sm = {2}>
                            <img src='/images/vase.jpg' class="img-thumbnail"></img>
                            <img src='/images/vase.jpg' class="img-thumbnail"></img>

                        </Col>
                        <Col sm = {2}>
                            <img src='/images/vase.jpg' class="img-thumbnail"></img>
                            <img src='/images/vase.jpg' class="img-thumbnail"></img>

                        </Col>
                        <Col sm = {2}>
                            <img src='/images/vase.jpg' class="img-thumbnail"></img>
                            <img src='/images/vase.jpg' class="img-thumbnail"></img>

                        </Col>

                        <Col sm = {MARGIN}></Col>
                    </FormGroup>


                    <Row>
                        <Col sm = {MARGIN}></Col>
                        <Col>
                        <h2 className="text-left" >Add a catagory</h2>
                        </Col>
                        <Col sm = {MARGIN}></Col>
                    </Row>


                    
                    <FormGroup row>
                        <Col sm = {MARGIN}></Col>
                        <Col sm={HALF -1}>
                            <Input 
                                onChange={this.onChange}
                                value={this.state.catagory}
                                type="select" 
                                id="catagory"
                                >

                                <option>Other</option>
                                <option>Jewlery</option>
                                <option>Clothes</option>
                                <option>Tool</option>
                                <option>Art</option>
                                <option>Book</option>
                                <option>Photo</option>
                                <option>Other</option>
                        </Input>
                        <ErrorAlert errorMsg={errors.Catagory} />
                        </Col>


                        <Col sm = {MARGIN}></Col>
                    </FormGroup>

                    <Row>
                        <Col sm = {MARGIN}></Col>
                        <Col>
                        <h2 className="text-left" >Add tags</h2>
                        </Col>
                        <Col sm = {MARGIN}></Col>
                    </Row>

                    
                    <FormGroup row>
                        <Col sm = {MARGIN}></Col>
                        <Col sm={HALF -1}>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend"><Button>Add tag</Button> </InputGroupAddon>
                            <Input 
                            placeholder="Add tags for others to search for your artifact"
                                />
                            </InputGroup>
                            <ErrorAlert errorMsg={errors.Keywords} />
                        </Col>

                        <Col sm = {MARGIN}></Col>
                    </FormGroup>



                    <Row>
                        <Col sm = {MARGIN}></Col>
                        <Col>
                        <h2 className="text-left" >Other details (optional)</h2>
                        </Col>
                        <Col sm = {MARGIN}></Col>
                    </Row>

                    <FormGroup row>
                        <Col sm = {MARGIN}></Col>
                        <Label htmlFor="Date Made" sm={2}>Date Made:</Label>
                        <Col sm={2}>
                        <Input
                            onChange={this.onChange}
                            value={this.state.date}
                            type="date"
                            name="date"
                            id="date"
                            />
                            <ErrorAlert errorMsg={errors.Date} />
                        </Col>
                        <Col sm = {MARGIN}></Col>
                    </FormGroup>

                </Form>


                <p className="text-center mt-3 mb-3 text-muted">&copy; Team FrankTheTank 2019</p>
                </Container>

            </div>

        )

    }



}

export default AddArtifact;