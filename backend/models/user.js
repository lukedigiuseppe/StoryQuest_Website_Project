var mongoose = require('mongoose');
//const enums = require('../models/enums.js');


var userSchema = mongoose.Schema(
    {
        // should username and email be the same?
        "email" : String,
        "publicName": String,
        "firstName": String,
        "lastName": String,
        "DOB": Date,
        "pictureURL": [{type: mongoose.Schema.Types.ObjectId, ref: 'media',default : null}],
        "password" : String
    }
);


module.exports =  mongoose.model('user',userSchema);