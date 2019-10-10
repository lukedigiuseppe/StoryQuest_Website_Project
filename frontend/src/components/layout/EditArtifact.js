import React, {Component} from 'react';
import Helmet from 'react-helmet';
import { Link }  from 'react-router-dom';
import {WithContext as ReactTags} from 'react-tag-input';
import PropTypes from "prop-types";
import {connect} from 'react-redux';
import {addNewArtifact} from '../../actions/artifactActions';
import {setVidUploading, setImgUploading, setHasNoVids, setHasNoImgs} from '../../actions/fileActions';
import ErrorAlert from '../alerts/ErrorAlert';

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


class EditArtifact extends Component{

    




}

export default EditArtifact;