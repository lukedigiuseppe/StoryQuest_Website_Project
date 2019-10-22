const mongoose = require('mongoose');

// This is currently unused, since we ran out of time to implement the collection feature.

const collectionSchema = mongoose.Schema(
    {
        // should username and email be the same?
        "collectionID": String,
        "collectionName" : String,
        // How should we store "password": String,
        "numItems": String,
        // A list of artifact objects
        "listArtifacts":[{type: mongoose.Schema.Types.ObjectId, ref: 'artifact',default : null}]
    }
);


module.exports =  mongoose.model('collection',collectionSchema);