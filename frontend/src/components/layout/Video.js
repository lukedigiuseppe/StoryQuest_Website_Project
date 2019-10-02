import React, {Component} from 'react';
import axios from 'axios';
// This component is a test sample of how to get videos from the backend. 

const encrypt = require('../../utils/encryption').encrypt;


class Video extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            iv: "",
            enc: "",
            artifactID: "",
            videoSRC: "/video"
        };

        axios.get("/artifact/" + "5d94b2b03c470b502ba0bc4d")
            .then(res => {
                // Just get the first video of every artifact
                const data = encrypt(res.data.videos[0]);
                this.state.iv = data.iv;
                this.state.enc = data.encryptedData;
                this.state.videoSRC = "/video/" + data.iv + "/" + data.encryptedData;
            });
    }
    
    componentDidMount() {
        
    }

    render() {
        // http://camddns.mynetgear.com:5000/video/ for when we are deploying
        return (
            <div>
                <h1>Video</h1>
                <h1>IV {this.state.iv}</h1>
                <h1>ENC {this.state.enc}</h1>
                <video width="1280" height="720" preload="metadata" controls autoPlay loop>
                    <source src={this.state.videoSRC} type="video/mp4" />
                </video>
            </div>
        )
    }
}

export default Video;