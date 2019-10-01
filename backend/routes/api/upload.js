// This file contains the upload routes to the server and for linking them to the database

const express = require("express");
const router = express.Router();
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const imgStore = require('../../storageEngines/imageStorageEngine');
const vidStore = require('../../storageEngines/videoStorageEngine');
const mime = require('mime-types');

// Load up the data models
const User = require("../../models/User");
const Artifact = require('../../models/Artifact');

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
    'Access-Control-Allow-Methods': 'OPTIONS, POST',
    'Access-Control-Max-Age': 2592000 // 30 days
  }

// Handle an options request by UPPY
router.options('/', function(req, res) {
    res.writeHead(204, "", HEADERS);
    res.end();
    return;
})

// @route POST /upload_artifact_image
// @desc Uploads artifact images to MongoDB and assigns their corresponding object IDs to the artifact.
// @access Restricted
router.post('/upload_artifact_image', function(req, res, next) {
    passport.authenticate('jwt', passportOpts, (err, user, info) => {

        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(401).send("Unauthorised user"); 
        }

        var form = new formidable.IncomingForm();

        // Set the options
        const MB = 1024*1024;
        const MAXFILESIZE = 4 * MB;

        form.uploadDir = './upload';
        form.keepExtensions = true;
        form.multiples = true;
        form.maxFileSize = MAXFILESIZE;

        // Events to respond to

        form.on('file', function(field, file) {
            // Rename to fixed profile image name
            const NEWPATH = form.uploadDir + "/" + file.name;
            fs.rename(file.path, NEWPATH, function(err) {
                if (err) {
                    return console.log(err);
                }
            });
        
            imgStore.upload(NEWPATH, file.name, function(err, file){

                if (err) {
                    if (!res.headersSent) {
                        return res.sendStatus(500);
                    }
                }

                // Assign image to the artifact object
                Artifact.findById(req.headers.artifactid, function(err, artifact) {
                    if (err) {
                        console.log(err);
                        if (!res.headersSent) {
                            return res.sendStatus(500);
                        }
                    }
                    
                    // Assign the ID to the user
                    artifact.images.push(file._id);
                    return artifact.save();
                });

                // Delete the file from the backend server once it has been uploaded to MongoDB
                fs.unlink(NEWPATH, (err) => {
                    if (err) {
                        console.error(err);
                        if (!res.headersSent) {
                            return res.sendStatus(500);
                        }
                    }
                });
            });
        });

        form.parse(req, function(err, fields, files) {
            if (!err) {
                var file = files['files[]'];
                console.log('saved file to', file.path)
                console.log('original name', file.name)
                console.log('type', file.type)
                console.log('size', file.size)
                if (!res.headersSent) {
                    return res.status(200).send({fields, files});
                }
            } else {
                console.log(err);
                if (!res.headersSent) {
                    res.status(500).send(JSON.stringify(err.toString()));
                    return res.end(); 
                }
            }
        });
    })(req, res, next);
});

router.post('/upload_artifact_video', function(req, res) {
    var form = new formidable.IncomingForm();

    // Set the options
    const MB = 1024*1024;
    const MAXFILESIZE = 200 * MB;

    form.uploadDir = './upload';
    form.keepExtensions = true;
    form.multiples = true;
    form.maxFileSize = MAXFILESIZE;

    // Events to respond to

    form.on('file', function(field, file) {
        // Rename to fixed profile image name
        const NEWPATH = form.uploadDir + "/" + file.name;
        fs.rename(file.path, NEWPATH, function(err) {
            if (err) {
                return console.log(err);
            }
        });

        // Determine whether the file is an image or video
        const contentType = mime.lookup(path.extname(NEWPATH));
        if (contentType) {
            if (contentType.includes('video')) {
                vidStore.uploadVideo(NEWPATH, file.name, function(err, file) {
                    if (err) {
                        if (!res.headersSent) {
                            return res.sendStatus(500);
                        }
                        return res.sendStatus(200);
                    }
                });
            }
        }
    });

        // imgStore.upload(NEWPATH, file.name, function(err, file){

        //     if (err) {
        //         if (!res.headersSent) {
        //             return res.sendStatus(500);
        //         }
        //     }

        //     // Save to MongoDB
        //     User.findOne({email: "test@gmail.com"}, function(err, user) {
        //         if (err) {
        //             console.log(err);
        //             if (!res.headersSent) {
        //                 return res.sendStatus(500);
        //             }
        //         }
                
        //         // Assign the ID to the user
        //         user.avatarImg = file._id;
        //         user.save();
        //     });
        // });

    // Now remove the uploaded files, once the form has finished parsing.
    form.on('end', function() {
        const directory = path.join(__dirname , '../../upload');

        fs.readdir(directory, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path.join(directory, file), err => {
                    if (err) throw err;
                });
            }
        });
    });

    form.parse(req, function(err, fields, files) {
        if (!err) {
            var file = files['files[]'];
            console.log('saved file to', file.path)
            console.log('original name', file.name)
            console.log('type', file.type)
            console.log('size', file.size)
            if (!res.headersSent) {
                return res.status(200).send({fields, files});
            }
        } else {
            console.log(err);
            if (!res.headersSent) {
                res.status(500).send(JSON.stringify(err.toString()));
                return res.end(); 
            }
        }
    });
});

module.exports = router;