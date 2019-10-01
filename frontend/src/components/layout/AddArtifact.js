import React, {Component} from 'react';
import Helmet from 'react-helmet';
import { Link }  from 'react-router-dom';
import ImageUpload from '../media/ImageUpload';
import {WithContext as ReactTags} from 'react-tag-input';
import PropTypes from "prop-types";
import {connect} from 'react-redux';
import axios from 'axios';

import {
    Container,
    Col,
    Row,
    Button, 
    Form, 
    FormGroup, 
    Label, 
    Input,
} from 'reactstrap';

import '../../css/addArtifact.css';
import '../../css/tags.css';

// Compononent that creates the regsitration page for new users.
// Need to add code that redirects to another page after pressing submit

const BANNER = "/images/cover.png"
const MARGIN = 1;
const HALF = 6;

// These are the keyboard keys that when pressed specify a new tag
const KeyCodes = {
    comma: 188,
    enter: 13
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];
// Change this to the Upload Route.
const UPLOAD_SERVER = 'http://localhost:5000/upload_artifact_image';

class AddArtifact extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            story: "",
            tags: [
                { id: 'default', text: 'Add more tags here'}
            ],
            category: "",
            dateMade: "",
            isPublic: "private",
            // These state values are used for image upload
            doUpload: false,
            artifactID: ""
        }

        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleTagClick = this.handleTagClick.bind(this);
    }

    // Events to handle for the react-tags module
    handleDelete(i) {
        const {tags} = this.state;
        this.setState({
            tags: tags.filter((tag, index) => index !== i),
        });
    }

    handleAddition(tag) {
        // Append the new tag to the existing array of tags.
        this.setState(state => ({ tags: [...state.tags, tag] }));
    }
    
    handleDrag(tag, currPos, newPos) {
        const tags = [...this.state.tags];
        const newTags = tags.slice();
    
        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);
    
        // re-render
        this.setState({ tags: newTags });
    }

    handleTagClick(index) {
        console.log('The tag at index ' + index + ' was clicked');
    }

    // Prevent user from accessing this page unless they are logged in
    componentDidMount() {
        if (!this.props.auth.isAuthenticated) {
            this.props.history.push('/login');
        }
    }
    
    onChange = (e) => {
        const type = e.target.type;
        const id = e.target.id;
        const value = e.target.value;
        var isPublic = "";

        // Set the public state depending on which radio button is checked.
        if (type === 'radio'){
            if(e.target.checked){
                if(id === 'private'){
                    isPublic = "private";
                } else if (id === 'friends') {
                    isPublic = "friends";
                } else if(id === 'public'){
                    isPublic = "public";
                }
            }
            this.setState({ isPublic: isPublic });
        } else {
            this.setState({ [id]: value });
        }
    };
    
    onSubmit = (e) => {
        e.preventDefault();

        // Remove the IDs from the tags, so they can be passed in as an array of strings directly to Mongo
        const TagArray = this.state.tags.map((tag) => tag.text);

        // Send the entire state including confirmation fields so that it can be validated at the backend
        const newArtifact = {
            name: this.state.name,
            story: this.state.story,
            tags: TagArray,
            category: this.state.category,
            isPublic: this.state.isPublic,
            dateMade: this.state.dateMade
        };
        
        // Axios POST request to backend to create the new artifact.
        axios
            .post('/newArtifact', newArtifact)
            .then(res => {
                console.log(res);
                // Need these to be sequential, so don't do them at the same time.
                this.setState({artifactID: res.data._id});
                this.setState({doUpload: true});
            })
            .catch(err => {
                console.log(err);
            });
        
    };

    render(){

        const { tags } = this.state;
        
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
            
                {/*FORM STARTS HERE*/}

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

                    <Row>

                        <Col sm = {MARGIN}></Col>
                        <Col>
                            <ImageUpload doUpload={this.state.doUpload} uploadPath={UPLOAD_SERVER} artifactID={this.state.artifactID} />
                            <br />
                        </Col>
                        <Col sm = {MARGIN}></Col> 

                    </Row>

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
                                value={this.state.category}
                                type="select" 
                                id="category"
                                name="category"
                                >
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
                        <Col sm={HALF}>
                        <ReactTags
                            tags={tags}
                            delimiters={delimiters}
                            handleDelete={this.handleDelete}
                            handleAddition={this.handleAddition}
                            handleDrag={this.handleDrag}
                            handleTagClick={this.handleTagClick}
                        />
                        </Col>
                        <Col sm = {MARGIN}></Col>
                    </FormGroup>
                <Row>
                    <Col sm = {MARGIN}></Col>
                    <Col>
                    <h2 className="text-left" >Sharing</h2>
                    </Col>
                    <Col sm = {MARGIN}></Col>
                </Row>

                {/* For radio buttons ensure name is the same so that users can only select one */}
                <Row>
                    <Col sm = {MARGIN*2}></Col>
                    <Col sm = {HALF} >
                    <FormGroup check>
                        <Label check>
                            <Input 
                            type="radio"
                                name="isPublic"
                                onChange={this.onChange}
                                value={this.state.isPublic}
                                id = "private"
                                />{' '}
                            Private - Only you can view your artifact 
                        </Label>
                    </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col sm = {MARGIN*2}></Col>
                    <Col sm = {HALF}>
                    <FormGroup check>
                        <Label check>
                            <Input type="radio" 
                            name="isPublic"
                            onChange={this.onChange}
                            value={this.state.isPublic}
                            id = "friends" 
                            />{' '}
                            Friends - Your friends can view your artifact 
                        </Label>
                    </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col sm = {MARGIN*2}></Col>
                    <Col sm = {HALF}>
                    <FormGroup check disabled>
                        <Label check>
                            <Input type="radio" 
                            name="isPublic"
                            onChange={this.onChange}
                            value={this.state.isPublic}
                            id = "public"
                            />{' '}
                            Public - Everyone can view your artifact 
                        </Label>
                    </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col sm = {MARGIN}></Col>
                    <Col>
                    <br />
                    <h2 className="text-left" >Other details (optional)</h2>
                    </Col>
                    <Col sm = {MARGIN}></Col>
                </Row>

                {/*DATE*/}

                <FormGroup row>
                    <Col sm = {MARGIN}></Col>
                    <Label htmlFor="dateMade" sm={2}>Date Made:</Label>
                    <Col sm={2}>
                    <Input
                        onChange={this.onChange}
                        value={this.state.dateMade}
                        type="date"
                        name="dateMade"
                        id="dateMade"
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

AddArtifact.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps
)(AddArtifact);