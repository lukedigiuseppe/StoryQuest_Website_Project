import {addNewArtifact} from '../../actions/artifactActions'; 
import {setVidUploading, setImgUploading, setHasNoVids, setHasNoImgs} from '../../actions/fileActions'; 
import ErrorAlert from '../alerts/ErrorAlert'; 
import EdiText from 'react-editext'; 
 
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
 
 
 
import '../../css/viewArtifact.css'; 
import axios from 'axios'; 
 
 
// Compononent that creates the regsitration page for new users. 
// Need to add code that redirects to another page after pressing submit 
 
 
const BANNER = "/images/cover.png"; 
const MARGIN = 1; 
 
const MAX_FIELD_LEN = 5000; 
 
 
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
            images: [], 
 
        } 
    } 
 
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
                   dateMade: res.data.dateMade, 
                   isPublic: res.data.isPublic, 
                   ownerID: res.data.ownerID, 
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
                               ] 
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
    return( 
 
        <div> 
              {/*Hemet*/} 
              <Helmet>  
                    <meta charset="utf-8" /> 
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" /> 
                    <title>Edit {this.state.name}</title> 
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
                        <Col sm = {MARGIN}></Col> 
                        <Col> 
                        <h2 className="text-left" >Edit your Artifact Details</h2> 
                        </Col> 
                        <Col sm = {MARGIN}></Col> 
                    </Row> 
 
 
                <Row> 
                    <Col xs = '1'> 
 
                    </Col> 
 
                    <Col xs="1" className="edit-text"> 
                        <div style={{height: "30px"}}>Name: &nbsp;</div> 
                    </Col> 
                    <Col xs="auto"> 
                    <EdiText 
                        type='text'  
                        validation={val => val.length <= MAX_FIELD_LEN} 
                        validationMessage={"Please type less than " + MAX_FIELD_LEN + " characters."} 
                        viewContainerClassName='edit-text input-group' 
                        viewProps={{ 
                            style: {textAlign: "left", width: "380px", wordWrap: "break-word"} 
                        }} 
                        editButtonClassName='btn-sm btn-secondary' 
                        editButtonContent='Edit' 
                        saveButtonContent='Apply' 
                        saveButtonClassName='btn-sm btn-secondary' 
                        cancelButtonContent='Cancel' 
                        cancelButtonClassName='btn-sm btn-primary' 
                        inputProps={{ 
                            className: 'justify-content-left' 
                        }} 
                        value={this.state.name} 
                        onSave={this.onSavePublicName} 
                    /> 
                    </Col> 
                    </Row> 
 
 
                </Container> 
        </div> 
    ) 
 
 
   } 
 
     
 
}