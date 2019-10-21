import React, {Component} from 'react';
import Helmet from 'react-helmet';
import {Link} from 'react-router-dom';
import PropTypes from "prop-types";
import axios from 'axios';
import {connect} from 'react-redux';
import {setUserLoading, setUserNotLoading} from '../../actions/authActions';

import Loading from './Loading';
import ProfileNavBar from '../layout/profileNavBar';
import TopMenu from '../layout/TopMenu';


import {
    Container,
    Col,
    Row,
    Button,

} from 'reactstrap';

const MARGIN = 1;

class DeleteImage extends Component {

    constructor(props) {
        super(props);
        this.onDelete = this.onDelete.bind(this);
    }

    onDelete () { 
        // Set the page as loading then reload on completion. 
        this.props.setUserLoading();
        axios.delete('/delete_image/' + this.props.artifactID + '/' + this.props.image.id)
        .then(res => {
            window.location.reload(true);
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        })
    }
    
    render () {

        if (this.props.auth.loading) {
            return <Loading />
        }

        return (
            <tr>
        
                <td> <img style={{width: "50%"}} alt="" src={this.props.image.src} /></td>
                <td>
                    <Button onClick={this.onDelete}>DELETE</Button>
                </td>
            
            </tr>
        )
    }
}

class EditImages extends Component{

    constructor(props){
        super(props);

        this.state = {
            images: [],
            ids:  [],
        }

        this.imageList = this.imageList.bind(this);


    }

    // Image list requires the auth to check user loading status, and the two corresponding functions that adjust the user's loading status
    imageList(artifactID, auth, setUserLoading, setUserNotLoading) {
        return this.state.images.map(function(currImage, i){
            return <DeleteImage 
                        image={currImage} 
                        artifactID={artifactID} 
                        auth={auth} 
                        setUserLoading={setUserLoading} 
                        setUserNotLoading={setUserNotLoading}
                        key={i} />;
        })
    }



    componentDidMount() {
        this.props.setUserLoading();
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
                                        header: "", 
                                        id: imageID
                                    }
                                ],
                                ids: [
                                    ...prevState.ids,
                                    imageID
                                ]
                            }));
                        this.props.setUserNotLoading();
                    })
                    .catch(err => {
                        console.log(err);
                        this.props.setUserNotLoading();
                    });
            });
        })
        .catch(err => {
            console.log(err);
            this.props.setUserNotLoading();
        });
}


    render(){

        var navMenu;
        if (this.props.auth.isAuthenticated) {
            navMenu = <ProfileNavBar history={this.props.history} />
        } else {
            navMenu = <TopMenu />
        }

        // Display loading screen if user is still loading
        if (this.props.auth.loading) {
            return <Loading />
        }

        return(
            <div>
                 {/*Hemet*/}
              <Helmet> 
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                    <title>Add/Delete Images</title>
                </Helmet>

                {navMenu}

                <Container style ={{transform: 'translate(0%,10%)', marginTop: "50px", marginBottom: "150px", paddingLeft: "50px", paddingRight: "50px"}} className="register-box bg-light rounded-lg">

                 {/*Form title*/}
                 <Row>
                     <Col xs = "6">
                     <Link to={'/edit_artifact/' + this.props.match.params.id}>
                        <Button style={{marginTop: "10px", marginBottom: "20px"}} color="primary">
                            <i className="far fa-arrow-alt-circle-left" style={{fontSize: "20px"}}> Go Back</i>
                        </Button>
                    </Link>
                    </Col>
                </Row>
                <br></br>

                <Row>
                <Col sm = {MARGIN}></Col>
                    <Col>
                    <Button href= {"/add_image/" + this.props.match.params.id} size ="lg" block> Upload Images </Button>
                    </Col>
                    <Col sm = {MARGIN}></Col>
                </Row>
                <br></br>
                <Row>
                        
                        <Col>
                        <h2 className="text-left" >Delete Images:</h2>
                        </Col>
                        <Col sm = {MARGIN}></Col>
                </Row>

                <Row>

                <table className="table table-striped justify-content-center" size="sm" >
                        <thead>
                        <tr>
                            <th className="tHeader">Image</th>
                            <th className="tHeader">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        { this.imageList(this.props.match.params.id, this.props.auth, this.props.setUserLoading, this.props.setUserNotLoading) }
                        </tbody>
                    </table>


                </Row>




            </Container>


            </div>
        )

        
    }

}

EditImages.propTypes = {
    auth: PropTypes.object.isRequired,
    setUserLoading: PropTypes.func.isRequired,
    setUserNotLoading: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(
    mapStateToProps,
    {setUserLoading, setUserNotLoading}
)(EditImages);