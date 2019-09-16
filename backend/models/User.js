// This is the data model for a user of our application

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");


const UserSchema = new Schema(
    {
        // should username and email be the same?
        // For now we only have a email and password be required.
        "email" : {
            type: String,
            isRequired: true
        },
        // Change this later, just for testing login
        "name": {
            type: String,
            isRequired: true
        },
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

// Now hash the password before we completely save the new user into the database
UserSchema.pre('save', function(next) {
    var user = this;
    var SALT_FACTOR = 10;

    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
        if (err) {
            return err;
        }
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) {
                return err;
            }
            user.password = hash;
            next();
        });
    });
});

// Export as a mongoose model which will be stored in a collection called users
module.exports =  User = mongoose.model("users", UserSchema);