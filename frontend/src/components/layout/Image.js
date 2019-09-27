import React, {Component} from 'react';
import axios from 'axios';
// This component is a test sample of how to get images from the backend. 

class Image extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imgData: ""
        };
    }
    
    componentDidMount() {
        // Change here for email of user you want to see
        axios.get('/api/users/profile/test@gmail.com')
            .then(res => {
                this.setState({imgData: res.data});
            })
    }

    render() {
        return (
            <div>
                <h1>This is a sample image stored on the backend server</h1>
                <p><img src={`data:image/jpeg;base64,${this.state.imgData}`} alt="Profile" /></p>
            </div>
        )
    }
}

export default Image;