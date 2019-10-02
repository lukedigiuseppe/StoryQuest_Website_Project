// This model records the servers local relative filepath of a given media object, in particular videos

const mongoose = require('mongoose');

const MediaSchema = mongoose.Schema(
    {
        "filePath": {
            type: String,
            isRequired: true,
            default: ""
        },
        // The below 2 fields are used to identify this media object uniquely for deletion should the exact same file be uploaded.
        "artifactID": {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'artifact',
            default : null
        },
        "md5": {
            type: String,
            isRequired: true,
            default: ""
        }
    }
);

// Export as a mongoose model which will be stored in a collection called media
const Media = mongoose.model("media", MediaSchema);
module.exports =  Media;