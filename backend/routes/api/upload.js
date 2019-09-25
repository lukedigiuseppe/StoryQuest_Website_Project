// This file contains the upload routes to the server and for linking them to the database

const express = require("express");
const router = express.Router();
const formidable = require("formidable");
const fs = require("fs");

// Load up the User module
const User = require("../../models/User");

// Imports required for securing the routes. Allows passport to verify the JWT sent by the client. 
// Requires the user model so make sure you load this after
const passport = require('passport');
require("../../config/passport")(passport);
const passportOpts = {
    session: false
};

const HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 2592000 // 30 days
  }

// Handle an options request by UPPY
router.options('/', function(req, res) {
    res.writeHead(204, "", HEADERS);
    res.end();
    return;
})

router.post('/upload', function(req, res) {
    var form = new formidable.IncomingForm();

    // Set the options
    const MB = 1024*1024;
    const MAXFILESIZE = 1000 * MB;

    form.uploadDir = './upload';
    form.keepExtensions = true;
    form.multiples = true;
    form.maxFileSize = MAXFILESIZE;

    // Events to respond to
    form.on('fileBegin', function(name, file) {
        file.path = __dirname + '/upload' + file.name;
    });

    form.on('file', function(field, file) {
        console.log(file.name);
        fs.rename(file.path, form.uploadDir + "/" + file.name, function(err) {
            if (err) {
                return console.log(err);
            }
        })
    });

    form.parse(req, function(err, fields, files) {
        if (!err) {
            var file = files['files[]'];
            console.log('saved file to', file.path)
            console.log('original name', file.name)
            console.log('type', file.type)
            console.log('size', file.size)
            return res.status(200).send({fields, files});
        } else {
            console.log(err);
            res.status(500).send(JSON.stringify(err.toString()));
            return res.end();
        }
    });
});

module.exports = router;