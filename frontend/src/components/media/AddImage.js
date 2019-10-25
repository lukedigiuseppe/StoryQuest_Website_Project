// This component renders an Uppy upload box with the purpose of uploading only artifact images. So to access it and for it to be
// successful you must be logged in and be the owner of the artifact being edited.

import '../../css/uppy.min.css';
import '@uppy/status-bar/dist/style.css';
import PropTypes from 'prop-types';

const React = require('react');
const Uppy = require('@uppy/core');
const Xhr = require('@uppy/xhr-upload');
const { Dashboard } = require('@uppy/react');

const MAXFILESIZE = 1024 * 1024 * 2;
const MAXFILENUM = 8;

const IMG_UPLOAD = 'http://localhost:5000/upload_artifact_image';

class AddImage extends React.Component {

    // Additional headers for the POST request. Artifact ID will be added as a custom header. 
    // default will be just the auth token
    customHeader = {
        "Authorization": localStorage.getItem("jwtToken"),
        "artifactID": this.props.match.params.id
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
                endpoint: IMG_UPLOAD, 
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
            this.props.history.push('/edit_images/' + this.props.match.params.id);
        })

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
            />
        </div>
        )
    }
}

AddImage.propTypes = {
    artifactID: PropTypes.string
};

export default (AddImage)