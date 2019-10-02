import '../../css/uppy.min.css';
import '@uppy/status-bar/dist/style.css';
import PropTypes from 'prop-types';

const React = require('react');
const Uppy = require('@uppy/core');
const Xhr = require('@uppy/xhr-upload');
const { Dashboard } = require('@uppy/react');

const MAXFILESIZE = 1024 * 1024 * 400;
const MAXFILENUM = 1;

class VideoUpload extends React.Component {

    // Additional headers for the POST request. Artifact ID will be added as a custom header. 
    // default will be just the auth token
    customHeader = {
        "Authorization": localStorage.getItem("jwtToken"),
        "artifactID": "",
    }

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
                endpoint: this.props.uploadPath, 
                method: 'post',
                headers: this.customHeader,
                formData: true,
                fieldName: 'files[]',
                // For our purposes, since we have quite a long delay after the video has finished parsing locally, still needs to be uploaded to Mongo
                // So set timeout to 0 to disable the check for upload progress events.
                timeout: 0,
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

    }

    componentDidUpdate(prevProps) {
        // Let Uppy upload when the submit button is clicked.
        if (this.props !== prevProps) {
            if (this.props.doUpload) {
                // Send the ID of the artifact that was made to the backend so it can auto assign the uploaded images.
                this.customHeader.artifactID = this.props.artifactID;
                this.uppy.upload();
            }
        }
    }

    componentWillUnmount () {
        this.uppy.close()
    }

    render () {
        return (
        <div>
            <Dashboard
                uppy={this.uppy}
                metaFields={[
                { id: 'name', name: 'Name', placeholder: 'File name' }
                ]}
                hideUploadButton={true}
                hideRetryButton={true}
            />
            
        </div>
        )
    }
}

VideoUpload.propTypes = {
    doUpload: PropTypes.bool,
    uploadPath: PropTypes.string.isRequired,
    artifactID: PropTypes.string.isRequired
};

export default VideoUpload;