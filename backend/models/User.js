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
        "publicName": {
            type: String,
            isRequired: true
        },
        "firstName": {
            type: String,
            isRequired: true
        },
        "lastName": {
            type: String,
            isRequired: true
        },
        "avatarImg": {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'images.files',
            default: null
        },
        // An array containing the emails of other users that have been recognised as "known" by the user
        "knownUsers": [{type: String}],
        "password" : {
            type: String,
            isRequired: true
        },
        "birthDate":  {
            type: Date,
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
    const user = this;
    const SALT_FACTOR = 10;

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

// This compares the unhashed password with the stored hash to check if they are the same.
UserSchema.methods.isValidPassword = function(password) {
    const user = this;
    const isValid = bcrypt.compare(password, user.password);
    return isValid;
}

// Export as a mongoose model which will be stored in a collection called users
const User = mongoose.model("users", UserSchema);
module.exports =  User;