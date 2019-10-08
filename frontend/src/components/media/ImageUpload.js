import '../../css/uppy.min.css';
import '@uppy/status-bar/dist/style.css';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {setImgUploaded, setHasImgs} from '../../actions/fileActions';

const React = require('react');
const Uppy = require('@uppy/core');
const Xhr = require('@uppy/xhr-upload');
const { Dashboard } = require('@uppy/react');

const MAXFILESIZE = 1024 * 1024 * 2;
const MAXFILENUM = 8;

class ImageUpload extends React.Component {

    // Additional headers for the POST request. Artifact ID will be added as a custom header. 
    // default will be just the auth token
    customHeader = {
        "Authorization": localStorage.getItem("jwtToken"),
        "artifactID": "",
    }

    constructor (props) {
        super(props)

        this.uppy = new Uppy({ 
            id: 'artifactImg', 
            restrictions: {
                maxFileSize: MAXFILESIZE,
                maxNumberOfFiles: MAXFILENUM,
                allowedFileTypes: ['image/*']
            },
            autoProceed: false, 
            debug: true 
        }).use(Xhr, 
            { 
                endpoint: props.uploadPath, 
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
        )

        // Handle upload error event, simply print to console
        this.uppy.on('upload-error', (file, error, response) => {
            console.log('error with file:', file.id)
            console.log('error message:', error)
        })

        // Set the img uploaded state to complete, once all images have been uploaded
        this.uppy.on('complete', (result) => {
            this.props.setImgUploaded();
        })

    }

    componentWillUnmount () {
        this.uppy.close()
    }

    componentDidUpdate(prevProps) {
        // Let Uppy upload when the submit button is clicked.
        if (this.props.doUpload !== prevProps.doUpload) {
            if (this.props.doUpload) {
                // Send the ID of the artifact that was made to the backend so it can auto assign the uploaded images.
                this.customHeader.artifactID = this.props.artifactID;
                // Only upload if we have files to upload
                if (this.uppy.getFiles().length !== 0) {
                    this.uppy.upload();
                }
            }
        }
        if (this.uppy.getFiles().length !== 0) {
            // Check if we have videos to upload, if so set to true, only if not already set to true
            if (!this.props.files.hasImgs) {
                this.props.setHasImgs();
            }
        }
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

ImageUpload.propTypes = {
    doUpload: PropTypes.bool,
    uploadPath: PropTypes.string.isRequired,
    files: PropTypes.object.isRequired,
    setImgUploaded: PropTypes.func.isRequired,
    setHasImgs: PropTypes.func.isRequired,
    artifactID: PropTypes.string
};

const mapStateToProps = state => ({
    files: state.files
});


export default connect(
    mapStateToProps,
    {setImgUploaded, setHasImgs}
)(ImageUpload);