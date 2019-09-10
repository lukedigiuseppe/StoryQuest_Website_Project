var mongoose = require('mongoose');
//const enums = require('../models/enums.js');


var userSchema = mongoose.Schema(
    {
        // should username and email be the same?
        "userName": String,
        "email" : String,
        // How should we store "password"
        "publicName": String,
        "firstName": String,
        "lastName": String,
        "DOB": Date,
        "location": String,
        // assuming we use random generator URL
        "pictureURL": String
    }
);


module.exports =  mongoose.model('user',userSchema);