import React, {Component} from 'react';
import axios from 'axios';
// This component is a test sample of how to get images from the backend. 

import {
    UncontrolledCarousel 
} from 'reactstrap';


class Image extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // Probs get this artifact ID from props later on
            artifactID: "5d9330cdcd596f54be4f261e",
            items: []
        };
    }
    
    componentDidMount() {
        // Get the artifact image array and go through each image ID calling an axios request to add it to the Carousel items
        axios.get('/artifact/' + this.state.artifactID)
            .then(res => {
                res.data.images.forEach(imageID => {
                    axios.get('/artifact_images/' + this.state.artifactID + '/' + imageID)
                        .then(res => {
                            this.setState(prevState => ({
                                    items: [
                                        ...prevState.items, 
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

    render() {
        return (
            <div>
                <h1>Images for Artifact ID: {this.state.artifactID}</h1>
                <UncontrolledCarousel items={this.state.items} autoPlay={false}/>
            </div>
        )
    }
}

export default Image;