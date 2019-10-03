import React, {Component} from 'react';
import axios from 'axios';
// import Video from '../media/Video';
import ReactPlayer from 'react-player';
// This component is a test sample of how to get videos from the backend. 

const encrypt = require('../../utils/encryption').encrypt;


class VideoTest extends Component {

    constructor(props) {
        super(props);
        this.state = {
            iv: "",
            enc: "",
            // Get the artifact ID from the URL
            artifactID: this.props.match.params.artifactid,
            videoSRC: ""
        };
    }
    
    componentDidMount() {
        // Pass in artifact ID as props here.
        axios.get("/artifact/" + this.state.artifactID)
            .then(res => {
                // Just get the first video of every artifact as long as it has a video
                if (typeof(res.data.videos) !== 'undefined' && res.data.videos.length > 0) {
                    const data = encrypt(res.data.videos[0]);
                    this.setState({
                        iv: data.iv,
                        enc: data.encryptedData,
                        videoSRC: "/video/" + data.iv + "/" + data.encryptedData
                    });
                }
            });
    }

    render() {
        // http://camddns.mynetgear.com:5000/video/ for when we are deploying
        const {videoSRC} = this.state;

        let videoPlayer;

        if (videoSRC === "") {
            // Display message saying there is no video
            videoPlayer = <h1>No video for this artifact. It might still be processing, check back later</h1>;
        } else {
            videoPlayer =   <ReactPlayer 
                                url={videoSRC} 
                                config={{
                                    file: {
                                        attributes: {
                                            autoPlay: true,
                                            preload: "metadata"
                                        }
                                    }
                                }}
                                width='75%' 
                                height='75%' 
                                controls 
                                loop
                                onError={e => this.props.history.push('/video/' + this.state.artifactID)}
                            />;
        }

        return (
            <div>
                <h1>Video</h1>
                <h1>IV {this.state.iv}</h1>
                <h1>ENC {this.state.enc}</h1>
                {videoPlayer}
            </div>
        )
    }
}

export default VideoTest;