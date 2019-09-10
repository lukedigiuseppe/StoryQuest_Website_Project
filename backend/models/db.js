const mongoose = require("mongoose");

//copy from CONNECT (MongoDB Atlas)
const dbURI =
    //"mongodb+srv://judithcc:Jm0ngodb%21@cluster0-r87zz.mongodb.net/test?retryWrites=true";
    "mongodb+srv://judithcc:Jm0ngodb%21@cluster0-r87zz.mongodb.net/test?retryWrites=true&w=majority";

const options = {
    useNewUrlParser: true,
    dbName: "storyquest"
};

mongoose.connect(dbURI, options).then(
    () => {
        console.log("Database connection established!");
    },
    err => {
        console.log("Error connecting Database instance due to: ", err);
    }
);

require('./artifact.js');
require('./user.js');
require('./collection.js');

//https://www.tutorialkart.com/nodejs/node-js-insert-documents-to-mongodb-collection/

