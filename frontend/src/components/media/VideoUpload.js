import '../../css/uppy.min.css';
import '@uppy/status-bar/dist/style.css';

const React = require('react')
const Uppy = require('@uppy/core')
const Xhr = require('@uppy/xhr-upload')
const { Dashboard } = require('@uppy/react')

// Change this to the Upload Route for the backend.
const UPLOAD_SERVER = 'http://localhost:5000/upload';
const MAXFILESIZE = 1024 * 1024 * 75;
const MAXFILENUM = 1;

class VideoUpload extends React.Component {
    constructor (props) {
        super(props)

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

    render () {
        return (
        <div>
            <Dashboard
                uppy={this.uppy}
                metaFields={[
                { id: 'name', name: 'Name', placeholder: 'File name' }
                ]}
            />
            <video width="1280" height="720" controls>
                <source src="/video" type="video/mp4" />
            </video>
        </div>
        )
    }
}
export default VideoUpload;