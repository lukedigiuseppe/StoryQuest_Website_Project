import React, {Component} from 'react';
import Helmet from 'react-helmet';
import { Link }  from 'react-router-dom';
import {WithContext as ReactTags} from 'react-tag-input';
import ErrorAlert from '../alerts/ErrorAlert';
import PropTypes from "prop-types";
import {connect} from 'react-redux';

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


import '../../css/tags.css';

import axios from 'axios';


// Compononent that creates the regsitration page for new users.
// Need to add code that redirects to another page after pressing submit


const BANNER = "/images/cover.png";
const MARGIN = 1;
const HALF = 6;
const KeyCodes = {
    comma: 188,
    enter: 13
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];


class EditArtifact extends Component{

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
            tags: [],
            images: [],


            errors: {}

        }
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleTagClick = this.handleTagClick.bind(this);
        this.tagConvert = this.tagConvert.bind(this);

    }


    tagConvert(tags){
        console.log(tags);

        var formatedTags = []
        var i;
        for (i = 0; i < tags.length; i++) {
            formatedTags.push({id:"default", text: tags[i]});
        }
        console.log(formatedTags);

        return formatedTags;
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
    
   /*Dealing with tags */
    handleDrag(tag, currPos, newPos) {
        const tags = [...this.state.tags];
        const newTags = tags.slice();
    
        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);
    
        // re-render
        this.setState({ tags: newTags });
    }
    /*Handle clicking tags */
    handleTagClick(index) {
        console.log('The tag at index ' + index + ' was clicked');
    }

    onSubmit = (e) => {
        e.preventDefault();

        // Remove the IDs from the tags, so they can be passed in as an array of strings directly to Mongo
        const TagArray = this.state.tags.map((tag) => tag.text);

        // Send the entire state including confirmation fields so that it can be validated at the backend
        const editedArtifact = {
            name: this.state.name,
            story: this.state.story,
            tags: TagArray,
            category: this.state.category,
            isPublic: this.state.isPublic,
            dateMade: this.state.dateMade
        };

        axios.patch('http://localhost:5000/update_artifact/' + this.props.match.params.id, editedArtifact) 
            .then(res => { 
                console.log(res); 
            }) 
            .catch(err => { 
                console.log(err); 
            }); 

    };

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



 

    componentDidMount() {


        /*Get the artifact information from backend using axios */
       axios.get('http://localhost:5000/artifact/' + this.props.match.params.id )
           .then(res => {
               console.log(res.data);
               // We then call setState here to assign the information we got back into our state so that we can render it.
               this.setState({
                   name: res.data.name,
                   story: res.data.story,
                   category: res.data.category,
                   dateMade: res.data.dateMade.slice(0,10),
                   isPublic: res.data.isPublic,
                   ownerID: res.data.ownerID,
                   tags: this.tagConvert(res.data.tags.split(" "))
               })


           })


           .catch(err => {
           
               console.log(err);
           });


       /*Get, process and package the images so reactstrap can display them */
       axios.get('/artifact/' + this.props.match.params.id)
       .then(res => {
           res.data.images.forEach(imageID => {
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
                               ],
                           }));
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

    const { tags, errors } = this.state;

    var navMenu;
        if (this.props.auth.isAuthenticated) {
            navMenu = <ProfileNavBar history={this.props.history} />
        } else {
            navMenu = <TopMenu />
        }
    return(

        

        <div>
              {/*Hemet*/}
              <Helmet> 
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                    <title>Edit {this.state.name}</title>
                </Helmet>

                {navMenu}


                <Container style ={{transform: 'translate(0%,10%)'}} className="register-box bg-light rounded-lg">

                 {/*Form title*/}
                 <Row>
                     <Col xs = "6">
                     <Button onClick={this.props.history.goBack} style={{marginLeft: "40px", marginTop: "10px", marginBottom: "20px"}} color="primary">
                            <i className="far fa-arrow-alt-circle-left" style={{fontSize: "20px"}}> Go Back</i>
                        </Button>
                    </Col>

                    
                </Row>
                <br></br>

                <Row>
                        <Col sm = {MARGIN}></Col>
                        <Col>
                        <h2 className="text-left" >Edit your Artifact Details</h2>
                        </Col>
                        <Col sm = {MARGIN}></Col>
                </Row>

                <Row>
                <Col sm = {MARGIN}></Col>
                    <Col>
                    <Button href= {"/edit_images/" + this.props.match.params.id} size ="lg" block> Delete/Upload Images </Button>
                    </Col>
                    <Col sm = {MARGIN}></Col>
                </Row>

                <Form noValidate className="register-form" onSubmit={this.onSubmit}>


                <Row>
                        <Col sm = {MARGIN}></Col>
                        <Col>
                        <h3 className="text-left" >Edit Name:</h3>
                        </Col>
                        <Col sm = {MARGIN}></Col>
                    </Row>

                <FormGroup row>

                    

                    <Col sm = {MARGIN}></Col>

                    <Col sm={HALF -1}>
                        <Input
                            onChange={this.onChange}
                            value={this.state.name}
                            type="text" 
                            id="name" 
                            name ="name"
                        />
                        <ErrorAlert errorMsg={errors.name} />
                    
                    </Col>

                    <Col sm = {HALF -1}></Col>

                    <Col sm = {MARGIN}></Col>
                    </FormGroup>


                    <Row>
                        <Col sm = {MARGIN}></Col>
                        <Col>
                        <h3 className="text-left" >Edit Story</h3>
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


                    <Row>
                        <Col sm = {MARGIN}></Col>
                        <Col>
                        <h3 className="text-left" >Edit Category</h3>
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
                        <h3 className="text-left" >Edit tags</h3>
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
                    <h3 className="text-left" >Edit Privacy</h3>
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
                    <h3 className="text-left" >Edit Date:</h3>
                    </Col>
                    <Col sm = {MARGIN}></Col>
                </Row>


                <FormGroup row>
                    <Col sm = {MARGIN}></Col>
                    <Col sm={3}>
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

                


        


                </Container>
        </div>
    )


   }

    




}

EditArtifact.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(
    mapStateToProps
)(EditArtifact);