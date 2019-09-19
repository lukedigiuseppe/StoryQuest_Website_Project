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
    FormText 
} from 'reactstrap';

import ErrorAlert from '../alerts/ErrorAlert';

import '../../css/addArtifact.css';

// Compononent that creates the regsitration page for new users.
// Need to add code that redirects to another page after pressing submit

const INPUTWIDTH = 10;
const DESCWIDTH = 2;
const BANNER = "/images/cover.png"


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

                {/*Form title*/}
                <Row>
                        <Link to="/" style={{paddingLeft: "40px", paddingTop: "10px", paddingBottom: "20px"}}>
                        <i className="far fa-arrow-alt-circle-left" style={{fontSize: "20px"}}> Back to Home</i>
                        </Link>
                </Row>
                <h1 className="text-left" style={{paddingLeft: "30px"}}>Register an Artifact</h1>




                <Form noValidate className="register-form" onSubmit={this.onSubmit}>

                    <FormGroup row>
                                <Label htmlFor="Name" sm={DESCWIDTH}>Name</Label>
                                <Col sm={INPUTWIDTH}>
                                    <Input
                                        onChange={this.onChange}
                                        value={this.state.name}
                                        error={errors.Name} 
                                        type="text" 
                                        id="name" 
                                        placeholder="Enter the name of your artifact" 
                                    />
                                    <ErrorAlert errorMsg={errors.Name} />
                                </Col>
                    </FormGroup>

                    
                    <FormGroup row>
                        <Label htmlFor="Catagory" sm={DESCWIDTH}>Catagory</Label>
                        <Col sm={INPUTWIDTH}>
                            <Input 
                                onChange={this.onChange}
                                value={this.state.catagory}
                                type="select" 
                                id="catagory" 
                                >

                                
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
                    </FormGroup>

                    <FormGroup row>
                        <Label htmlFor="Date Made" sm={DESCWIDTH}>Date Made</Label>
                        <Col sm={INPUTWIDTH}>
                        <Input
                            onChange={this.onChange}
                            value={this.state.date}
                            type="date"
                            name="date"
                            id="date"
                            />
                            <ErrorAlert errorMsg={errors.Date} />
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                    <Label htmlFor="Story" sm={DESCWIDTH}>Story</Label>
                        <Col sm={INPUTWIDTH}>
                        <Input 
                            style = {{height: '200px'}}
                            onChange={this.onChange}
                            value={this.state.story}
                            type="textarea" 
                            name="text" 
                            id="story" 
                            placeholder= "Write a description of your artifact"
                            />
                            <ErrorAlert errorMsg={errors.Story} />

                        </Col>  
                    </FormGroup>

                    <FormGroup row>
                        <Label htmlFor="Keywords" sm={DESCWIDTH}>Keywords</Label>
                        <Col sm={INPUTWIDTH}>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend"><Button>Add Keyword</Button> </InputGroupAddon>
                            <Input 
                            placeholder="Add tags for others to search for your artifact"
                                />
                            </InputGroup>
                            <ErrorAlert errorMsg={errors.Keywords} />
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label htmlFor="Images" sm={DESCWIDTH}>Images</Label>
                        <Col sm={INPUTWIDTH}>
                            <Label for="ImageFile">ImageFile</Label>
                            <Input type="file" name="file" id="exampleFile" />
                            <FormText color="muted">
                                Upload a photo of your artifact.
                            </FormText>



                        </Col>
                    </FormGroup>

                </Form>


                <p className="text-center mt-3 mb-3 text-muted">&copy; Team FrankTheTank 2019</p>
                </Container>

            </div>

        )

    }



}

export default AddArtifact;