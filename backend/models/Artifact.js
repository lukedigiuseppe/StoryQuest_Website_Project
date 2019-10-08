const mongoose = require('mongoose');

// Artifact attributes

const ArtifactSchema = mongoose.Schema(
    {
        // A serial number and passcode is used to view an artifact regardless of privacy settings or ownership
        "serialNumber": {
            type: String,
            isRequired: true
        },
        "passcode": {
            type: String,
            isRequired: true
        },
        "name": {
            type: String,
            isRequired: true
        },
        "story": String,
        "images": [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "images.files",
            default: null
        }],
        "videos": [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "videos.files",
            default: null
        }],
        "tags": {
            type: String,
            default: ""
        },
        "category": String,
        // ownerID + collectionID allows you to add multiple owners and collections
        // [{ }] - represents a list of objects
        "ownerID": [{type: mongoose.Schema.Types.ObjectId, ref: 'user',default : null}],
        // the default value for collectionID is null, as an artifact does not need to be
        // part of a collection
        "collectionID": [{type: mongoose.Schema.Types.ObjectId, ref: 'collection',default : null}],
        "isPublic" : {
            type: String,
            // Defines a restriction of strings to be private, friends and public only
            enum: ['private', 'friends', 'public'],
            isRequired: true,
            default: 'private'
        },
        "dateMade" : {
            type: Date,
        },
        "dateAdded" : {
            type: Date,
            default: Date.now
        }
    }
);

ArtifactSchema.index({
    name: 'text', 
    story: 'text', 
    tags: 'text'
}, {
    weights: {
        name: 5, 
        tags: 3, 
        story: 2
    }
});

const Artifact = mongoose.model('Artifact', ArtifactSchema);
module.exports =  Artifact;