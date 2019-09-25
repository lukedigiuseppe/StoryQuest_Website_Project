import '../../css/uppy.min.css';
import '@uppy/status-bar/dist/style.css';

const React = require('react')
const Uppy = require('@uppy/core')
const Xhr = require('@uppy/xhr-upload')
const { Dashboard } = require('@uppy/react')

// Change this to the Upload Route.
const UPLOAD_SERVER = 'http://localhost:5000/upload'

class FileUpload extends React.Component {
    constructor (props) {
        super(props)

        this.uppy = new Uppy({ id: 'uppy', autoProceed: false, debug: true })
        .use(Xhr, 
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
            <h1>Upload File Test</h1>

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
export default FileUpload;