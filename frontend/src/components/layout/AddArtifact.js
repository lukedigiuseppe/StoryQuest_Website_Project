// This component renders the fields necessary to add a new artifact as well as providing the logic for sending it to the backend server

import React, {Component} from 'react';
import Helmet from 'react-helmet';
import { Link }  from 'react-router-dom';
import {WithContext as ReactTags} from 'react-tag-input';
import PropTypes from "prop-types";
import {connect} from 'react-redux';
import {addNewArtifact} from '../../actions/artifactActions';
import {setVidUploading, setImgUploading, setHasNoVids, setHasNoImgs} from '../../actions/fileActions';

import ErrorAlert from '../alerts/ErrorAlert';
import ProfileNavBar from '../layout/profileNavBar';
import TopMenu from '../layout/TopMenu';

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

import ImageUpload from '../media/ImageUpload';
import VideoUpload from '../media/VideoUpload';

import '../../css/tags.css';
import '../../css/addArtifact.css'; 

// Compononent that creates the regsitration page for new users.
// Need to add code that redirects to another page after pressing submit

const MARGIN = 1;
const HALF = 6;

// These are the keyboard keys that when pressed specify a new tag
const KeyCodes = {
    comma: 188,
    enter: 13
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];
// Change this to the Upload Route.
const IMG_UPLOAD = 'http://localhost:5000/upload_artifact_image';
const VIDEO_UPLOAD = 'http://localhost:5000/upload_artifact_video';

class AddArtifact extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // State values representing the different required artifact fields from the user
            name: "",
            story: "",
            tags: [
                { id: 'default', text: 'Add more tags here'}
            ],
            category: "Jewelry",
            dateMade: "",
            isPublic: "",
            // These state values are used for image upload
            doImgUpload: false,
            doVideoUpload: false,
            artifactID: "",
            errors: {}
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

    componentDidUpdate(prevProps) {
        // Video/image uploading logic to push the page to home on a video/image upload
        if (this.props.files.imgUploaded && this.props.files.hasImgs) {
            this.props.setImgUploading();
            this.props.setHasNoImgs();
            if (this.props.files.hasVids) {
                this.setState({doVideoUpload: true});
            } else {
                this.props.history.push('/');
            }
        }

        if (this.props.files.vidUploaded && this.props.files.hasVids) {
            this.props.setVidUploading();
            this.props.setHasNoVids();
            this.props.history.push('/');
        }

        if (this.props.errors !== prevProps.errors) {
            this.setState({
                errors: this.props.errors
            });
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

        // Remove the IDs from the tags, so they can be passed in as an array of strings directly to Mongo for storage
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

        this.props.addNewArtifact(newArtifact, (res) => {
            // Need these to be sequential, so don't do them at the same time.
            this.setState({artifactID: res.data._id});
            // Check if there are imgs if so do imgUpload otherwise do vid upload
            if (this.props.files.hasImgs) {
                this.setState({doImgUpload: true});
            } else if (this.props.files.hasVids) {
                this.setState({doVideoUpload: true});
            }
            // Push to artifact page on submit only if there were no images or videos being uploaded to the artifact. Otherwise push to homepage so we
            // can give the system some time to process the images and videos for a better user experience.
            const pushPage = this.props.files.hasVids || this.props.files.hasImgs;
            if (!pushPage) {
                this.props.history.push('/view_artifact/' + this.state.artifactID);
            }
        });

    };

    render(){

        const { tags, errors } = this.state;
        // Pick which nav menu to display depending on user login status
        var navMenu;
        if (this.props.auth.isAuthenticated) {
            navMenu = <ProfileNavBar history={this.props.history} />
        } else {
            navMenu = <TopMenu />
        }
        
        return(
            <div>
                {/*Title*/}
                <Helmet> 
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                    <title>Register an artifact</title>
                </Helmet>

                {/* Nav bar */}
                {navMenu}
                
                <Container className="artifact-box bg-light rounded-lg" style={{paddingTop: "20px", paddingBottom: "10px", transform: "translate(0%, 5%)"}}>

                { /* back to home button*/} 
                <Row>
                        <Link to="/" style={{paddingLeft: "40px", paddingTop: "10px", paddingBottom: "20px"}}>
                        <i className="far fa-arrow-alt-circle-left" style={{fontSize: "20px"}}> Back to Home</i>
                        </Link>
                </Row>
            
                {/*FORM STARTS HERE*/}

                <Form noValidate className="artifact-form" onSubmit={this.onSubmit}>
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
                            <ErrorAlert errorMsg={errors.name} />
                           
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
                            <ErrorAlert errorMsg={errors.story} />

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
                            <ImageUpload doUpload={this.state.doImgUpload} uploadPath={IMG_UPLOAD} artifactID={this.state.artifactID} />
                            <br />
                        </Col>
                        <Col sm = {MARGIN}></Col> 

                    </Row>

                    {/* VIDEOS */}
                    <Row>
                        <Col sm = {MARGIN}></Col>
                        <Col>
                        <h2 className="text-left" >Add Videos</h2>
                        </Col>
                        <Col sm = {MARGIN}></Col>
                    </Row>

                    <Row>

                        <Col sm = {MARGIN}></Col>
                        <Col>
                            <VideoUpload doUpload={this.state.doVideoUpload} uploadPath={VIDEO_UPLOAD} artifactID={this.state.artifactID} />
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
                                {/* The first option is the same as the default state */}
                                <option>Jewlery</option>
                                <option>Clothes</option>
                                <option>Tool</option>
                                <option>Art</option>
                                <option>Book</option>
                                <option>Photo</option>
                                <option>Other</option>
                        </Input>
                        <ErrorAlert errorMsg={errors.category} />
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
                        <ErrorAlert errorMsg={errors.tag} />
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
                {/*Choose artifact privacy */}
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
                    <ErrorAlert errorMsg={errors.isPublic} />
                    </Col>
                    <Col sm = {MARGIN}></Col>
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
                        <ErrorAlert errorMsg={errors.dateMade} />
                    </Col>
                    <Col sm = {MARGIN}></Col>
                </Row>

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
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    files: PropTypes.object.isRequired,
    setVidUploading: PropTypes.func.isRequired,
    setImgUploading: PropTypes.func.isRequired,
    setHasNoVids: PropTypes.func.isRequired,
    setHasNoImgs: PropTypes.func.isRequired,
    addNewArtifact: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors,
    files: state.files
});

export default connect(
    mapStateToProps,
    {setVidUploading, setImgUploading, setHasNoVids, setHasNoImgs, addNewArtifact}
)(AddArtifact);