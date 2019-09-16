// This is the data model for a user of our application

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema(
    {
        // should username and email be the same?
        // For now we only have a email and password be required.
        "email" : {
            type: String,
            isRequired: true
        },
        "publicName": String,
        "firstName": String,
        "lastName": String,
        "DOB": Date,
        "pictureURL": [{type: mongoose.Schema.Types.ObjectId, ref: 'media',default : null}],
        "password" : {
            type: String,
            isRequired: true
        },
        "dateCreated" : {
            type: Date,
            default: Date.now
        }
    }
);

// Export as a mongoose model which will be stored in a collection called users
module.exports =  User = mongoose.model("users", UserSchema);