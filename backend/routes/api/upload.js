// This file contains the upload routes to the server and the logic to both store on MongoDB and to link those
// objects to their corresponding artifacts.

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
const Media = require("../../models/Media");

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
            const NEWPATH = form.uploadDir + "/" + file.name;
            fs.rename(file.path, NEWPATH, function(err) {
                if (err) {
                    return console.log(err);
                }
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
                        
                        // Assign the ID to the artifact
                        artifact.images.push(file._id);
                        artifact.save();
                        // On successful assignment return response to update Uppy's progress.
                        if (!res.headersSent) {
                            return res.status(200).send(file);
                        }
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
        });

        form.parse(req, function(err, fields, files) {
            if (!err) {
                // Print out the details of the file that was just saved if no error
                var file = files['files[]'];
                console.log('saved file to', file.path)
                console.log('original name', file.name)
                console.log('type', file.type)
                console.log('size', file.size)
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

// @route POST /upload_artifact_video
// @desc Uploads artifact videos to MongoDB and assigns their corresponding object IDs to the artifact.
// @access Restricted
router.post('/upload_artifact_video', function(req, res, next) {

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
        const MAXFILESIZE = 200 * MB;

        form.uploadDir = './upload';
        form.keepExtensions = true;
        form.multiples = true;
        form.maxFileSize = MAXFILESIZE;

        // Events to respond to

        form.on('file', function(field, file) {
            const NEWPATH = form.uploadDir + "/" + file.name;
            fs.rename(file.path, NEWPATH, function(err) {
                if (err) {
                    return console.log(err);
                }
            });

            // Confirm that the file is of the correct type
            const contentType = mime.lookup(path.extname(NEWPATH));
            if (contentType) {
                if (contentType.includes('video')) {
                    // Create a Media document to store the local file path and also assign it to the artifact that is associated with it
                    // We rename the uploaded file to the object ID for the media object just created.
                    var newMedia = new Media();
                    newMedia.filePath = form.uploadDir + '/' + newMedia._id + path.extname(NEWPATH);

                    // Now rename the actual file
                    fs.rename(NEWPATH, newMedia.filePath, (err) => {
                        if (err) {
                            throw err;
                        }

                        // Assign the video to the artifact object
                        Artifact.findById(req.headers.artifactid, function(err, artifact) {
                            if (err) {
                                console.log(err);
                                if (!res.headersSent) {
                                    return res.sendStatus(500);
                                }
                            }

                            // Check if artifact exists
                            if (!artifact) {
                                if (!res.headersSent) {
                                    return res.status(404).send("The artifact for this media object does not exist.");
                                }
                            }

                            newMedia.artifactID = req.headers.artifactid;
                            newMedia.save()
                                .then( doc => {
                                    console.log(doc);
                                    // Assign the ID to the artifact
                                    artifact.videos.push(newMedia._id);
                                    artifact.save()
                                        .catch(err => {
                                            throw err;
                                        });
                                })
                                .catch(err => {
                                    throw err;
                                });
                            // On successful creation return response to update Uppy's progress if the other upload isn't done yet.
                            if (!res.headersSent) {
                                return res.status(200).send(newMedia);
                            }
                        });

                        vidStore.uploadVideo(newMedia.filePath, file.name, function(err, file) {
                            if (err) {
                                if (!res.headersSent) {
                                    return res.sendStatus(500);
                                }
                            }

                            // Assign the video to the artifact object
                            Artifact.findById(req.headers.artifactid, function(err, artifact) {
                                if (err) {
                                    console.log(err);
                                    if (!res.headersSent) {
                                        return res.sendStatus(500);
                                    }
                                }

                                // Check if artifact exists
                                if (!artifact) {
                                    if (!res.headersSent) {
                                        return res.status(404).send("The artifact for this media object does not exist.");
                                    }
                                }

                                // Delete from media collection and from the artifact videos array
                                Media.findOneAndDelete({artifactID: artifact._id, filePath: newMedia.filePath}, (err, media) => {
                                    // If media exists then remove it from the artifact video array, otherwise just add the ID
                                    if (media) {
                                        // Assign the ID to the artifact
                                        artifact.videos.push(file._id);
                                        var index = artifact.videos.indexOf(media._id);
                                        if (index > -1) {
                                            // Greater than -1 means, that media ID was found successfully
                                            artifact.videos.splice(index, 1);
                                        }
                                        artifact.save()
                                            .catch(err => {
                                                throw err;
                                            });
                                        // Remove the local file has been successfully added to MongoDB
                                        fs.unlink(media.filePath, (err) => {
                                            if (err) {
                                                throw err;
                                            }
                                            if (!res.headersSent) {
                                                return res.sendStatus(500);
                                            }
                                        });
                                    } else {
                                        // Assign the ID to the artifact
                                        artifact.videos.push(file._id);
                                        artifact.save()
                                            .catch(err => {
                                                throw err;
                                            });
                                    }
                                });
                            });
                        });
                    });
                }
            }
        });

        form.parse(req, function(err, fields, files) {
            if (!err) {
                var file = files['files[]'];
                console.log('saved file to', file.path)
                console.log('original name', file.name)
                console.log('type', file.type)
                console.log('size', file.size)
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

module.exports = router;