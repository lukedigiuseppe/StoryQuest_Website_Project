// This component renders an Uppy Upload box made specifically to upload a profile image for the user
import '../../css/uppy.min.css';
import '@uppy/status-bar/dist/style.css';
import PropTypes from 'prop-types';

const React = require('react');
const Uppy = require('@uppy/core');
const Xhr = require('@uppy/xhr-upload');
const { Dashboard } = require('@uppy/react');

const MAXFILESIZE = 1024 * 1024 * 1;
const MAXFILENUM = 1;

class ProfileImgUpload extends React.Component {

    // Additional headers for the POST request. Artifact ID will be added as a custom header. 
    // default will be just the auth token
    customHeader = {
        "Authorization": localStorage.getItem("jwtToken"),
    }

    constructor (props) {
        super(props)

        this.uppy = new Uppy({ 
            id: 'avatarImg', 
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

        // When upload completes successfully redirect to the myprofile page
        this.uppy.on('complete', (result) => {
           window.location.href ='/myprofile'
        })

    }

    componentWillUnmount () {
        this.uppy.close()
    }

    render () {
        return (
        <div>
            <h1>Upload profile image for yourself</h1>
            <Dashboard
                uppy={this.uppy}
                metaFields={[
                { id: 'name', name: 'Name', placeholder: 'File name' }
                ]}
            />
        </div>
        )
    }
}

ProfileImgUpload.propTypes = {
    uploadPath: PropTypes.string.isRequired
};

export default ProfileImgUpload;