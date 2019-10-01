import '../../css/uppy.min.css';
import '@uppy/status-bar/dist/style.css';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

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

    }

    componentWillUnmount () {
        this.uppy.close()
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
    auth: PropTypes.object
};

const mapStateToProps = state => ({
    auth: state.auth
});


export default connect(mapStateToProps)(ImageUpload);