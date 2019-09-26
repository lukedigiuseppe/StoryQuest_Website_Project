import React, {Component} from 'react';
import Helmet from 'react-helmet';
import { Link }  from 'react-router-dom';

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
    Card, 
    CardImg, 
    CardBody,
    CardTitle,
} from 'reactstrap';


import '../../css/addArtifact.css';

// Compononent that creates the regsitration page for new users.
// Need to add code that redirects to another page after pressing submit

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
            image: null,
            privacy: 3
        }
    }


    onChange = (e) => {
        const target = e.target;
        const type = target.type;
        const name = target.name;
        const id = target.id;
        const value = target.value;
        var privacy;

        if (type === 'radio'){
            if(target.checked){
                if(name === 'privacy3'){
                    privacy = 3
                }
                else if(name === 'privacy2'){
                    privacy = 2
                }
                else if(name === 'privacy1'){
                    privacy = 1
                }
            }
            this.setState({ [id]: privacy });
        }

        else{
    
            this.setState({ [id]: value });
        }
    
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

    };


    render(){
        
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

                { /* back to home button*/} 
                <Row>
                        <Link to="/" style={{paddingLeft: "40px", paddingTop: "10px", paddingBottom: "20px"}}>
                        <i className="far fa-arrow-alt-circle-left" style={{fontSize: "20px"}}> Back to Home</i>
                        </Link>
                </Row>
            
                {
                    /*FORM STARTS HERE
                 */}


                <Form noValidate className="register-form" onSubmit={this.onSubmit}>
                    <Row>
                        <Col sm = {MARGIN}></Col>
                        <Col>
                        <h2 className="text-left" >Add a new artifact</h2>
                        </Col>
                        <Col sm = {MARGIN}></Col>
                    </Row>

                    {/*NAME*/}

                    <FormGroup row>

                        <Col sm = {MARGIN}></Col>

                        <Col sm={HALF -1}>
                            <Input
                                onChange={this.onChange}
                                value={this.state.name}
                                type="text" 
                                id="name" 
                                name ="name"
                                placeholder="What's your artifact called?" 
                            />
                           
                        </Col>

                        <Col sm = {HALF -1}></Col>

                        <Col sm = {MARGIN}></Col>
                    </FormGroup>

                    {/*STORY*/}

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
                                name="story" 
                                id="story" 
                                placeholder= "Tell us about its journey"
                                />
                               

                        </Col>  

                        <Col sm = {MARGIN}></Col>
                    </FormGroup>

                    {/*PHOTOS*/}

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
                            onChange={this.onChange}
                            value={this.state.image}
                            style = {{height: '100px'}}
                            name = "image"
                            type="file" 
                            id="image" 
                            />
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


                    {/*CATEGORY*/}


                    <Row>
                        <Col sm = {MARGIN}></Col>
                        <Col>
                        <h2 className="text-left" >Add a category</h2>
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
                                name="catagory"
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

                    {/*TAGS*/}
                    
                    <FormGroup row>
                        <Col sm = {MARGIN}></Col>
                        <Col sm={HALF -1}>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend"><Button>Add tag</Button> </InputGroupAddon>
                            <Input 
                            placeholder="Add tags for others to search for your artifact"
                                />
                            </InputGroup>
                           
                        </Col>

                        <Col sm = {MARGIN}></Col>
                    </FormGroup>


                    <FormGroup tag="fieldset" row>

                        <Row>
                        <Col sm = {MARGIN}></Col>
                        <Col>
                        <h2 className="text-left" >Sharing</h2>
                        </Col>
                        <Col sm = {MARGIN}></Col>


                        </Row>

                        <Row>
                        
                        <Col sm = {MARGIN*2}></Col>
                            <FormGroup check>
                                <Label check>
                                    <Input 
                                    type="radio"
                                     name="privacy"
                                     onChange={this.onChange}
                                     value={this.state.privacy}
                                     id = "privacy3"
                                      />{' '}
                                    Private - Only you can view your artifact
                                </Label>
                            </FormGroup>

                            </Row>

                            <Row>
                            <Col sm = {MARGIN*2}></Col>
                            <FormGroup check>
                           

                                <Label check>
                                    <Input type="radio" 
                                    name="privacy"
                                    onChange={this.onChange}
                                    value={this.state.privacy}
                                    id = "privacy2" 
                                    />{' '}
                                    Friends - Your friends can view your artifact
                                </Label>
                            </FormGroup>
                            </Row>

                            <Row>
                            <Col sm = {MARGIN*2}></Col>
                            <FormGroup check disabled>
                                <Label check>
                                    <Input type="radio" 
                                    name="privacy"
                                    onChange={this.onChange}
                                    value={this.state.privacy}
                                    id = "privacy1"
                                    />{' '}
                                    Public - Everyone can view your artifact
                                </Label>
                            </FormGroup>

                            </Row>

                           
                    </FormGroup>

                        



                    <Row>
                        <Col sm = {MARGIN}></Col>
                        <Col>
                        <h2 className="text-left" >Other details (optional)</h2>
                        </Col>
                        <Col sm = {MARGIN}></Col>
                    </Row>


                    {/*DATE*/}

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
                        </Col>
                        <Col sm = {MARGIN}></Col>
                    </FormGroup>

                    <Row>
                        <Col sm = {MARGIN}></Col>
                        <Col>
                        <Button>Submit</Button>
                        </Col>
                    </Row>


                </Form>


                <p className="text-center mt-3 mb-3 text-muted">&copy; Team FrankTheTank 2019</p>
                </Container>

            </div>

        )

    }



}

export default AddArtifact;