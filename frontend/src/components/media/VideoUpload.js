import '../../css/uppy.min.css';
import '@uppy/status-bar/dist/style.css';

const React = require('react');
const Uppy = require('@uppy/core');
const Xhr = require('@uppy/xhr-upload');
const { Dashboard } = require('@uppy/react');
const encrypt = require('../../utils/encryption').encrypt;
const axios = require('axios');

// Change this to the Upload Route for the backend.
const UPLOAD_SERVER = 'http://localhost:5000/upload';
const MAXFILESIZE = 1024 * 1024 * 400;
const MAXFILENUM = 1;

class VideoUpload extends React.Component {
    constructor (props) {
        super(props);

        this.uppy = new Uppy({ 
            id: 'artifactVideo', 
            restrictions: {
                maxFileSize: MAXFILESIZE,
                maxNumberOfFiles: MAXFILENUM,
                allowedFileTypes: ['video/*']
            },
            autoProceed: false, 
            debug: true 
        }).use(Xhr, 
            { 
                endpoint: UPLOAD_SERVER, 
                method: 'post',
                formData: true,
                fieldName: 'files[]',
                getResponseError (responseText, res) {
                    console.log(res);
                    if (responseText) {
                        return new Error(responseText);
                    }
                }
            }
        );
        
        // Handle upload error event, simply print to console
        this.uppy.on('upload-error', (file, error, response) => {
            console.log('error with file:', file.id)
            console.log('error message:', error)
        });

        this.state = {
            iv: "",
            enc: ""
        };
    }

    componentDidMount() {
        const data = encrypt("5d90b09c88cd4e22965c4f12");
        this.setState({
            iv: data.iv,
            enc: data.encryptedData
        });

        // axios.post('/api/users/profile/test@gmail.com')
        //     .then(res => {
        //         this.setState({imgData: res.data});
        //     })

    }

    componentWillUnmount () {
        this.uppy.close()
    }

    render () {
        const VIDSRC = "/video/" + this.state.iv + "/" + this.state.enc;
        return (
        <div>
            <Dashboard
                uppy={this.uppy}
                metaFields={[
                { id: 'name', name: 'Name', placeholder: 'File name' }
                ]}
            />
            <video width="1280" height="720" preload="metadata" controls>
                <source src={VIDSRC} type="video/mp4" />
            </video>
        </div>
        )
    }
}
export default VideoUpload;