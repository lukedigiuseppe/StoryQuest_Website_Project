// This file contains the routes that the server backend will provide regarding all artifact actions

const express = require("express");
const router = express.Router();
const Artifact = require("../../models/Artifact");
const User = require("../../models/User");
const Media = require("../../models/Media");
const imgStore = require('../../storageEngines/imageStorageEngine');
const vidStore = require('../../storageEngines/videoStorageEngine');
const decrypt = require('../../config/encryption').decrypt;
const cryptoString = require("crypto-random-string");

// Load the validators
const validateAddArtifact = require("../../validation/artifactValidator");
 
// Imports required for securing the routes. Allows passport to verify the JWT sent by the client.
const passport = require('passport');
require("../../config/passport")(passport);
const passportOpts = {
    session: false
};

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// @route GET /artifacts
// @desc View all public artifacts
// @access Public
router.get('/artifacts', function (req, res) {
    Artifact.find({isPublic: "public"}, function (err, artifact) {
        if (!err) {
            res.send(artifact);
        } else {
            res.status(404).send("Unable to retrieve any artifacts. Please try again later or contact the site admin.");
        }
    });
});

// @route POST /searchartifacts
// @desc Returns artifacts that match the keywords specified by the search
// @access Public but only returns public artifacts. If user is logged in will return their own artifacts as well.
router.post('/searchartifacts', function(req, res, next) {
    passport.authenticate('jwt', passportOpts, (err, user, info) => {
        if (err) {
            return next(err);
        }

        // If it is a guest or unregsitered user, they are only allowed to search for public artifacts
        if (!user) {
            Artifact.find({$text: { $search: req.body.searchString }, isPublic: "public"}, {score: { $meta: `textScore` }} )
                .sort({score: {$meta: `textScore`}})
                .exec(function(err, artifacts) {
                    if (err) {
                        return res.status(400).send("Error: Search function has failed. Try again later.");
                    }
                    return res.send(artifacts);
                });
        } else {
            // Otherwise they are allowed to search for public artifacts, plus the ones they have created or set to friend level privacy
            Artifact.find({$text: { $search: req.body.searchString }, $or: [ {isPublic: "private"}, {isPublic: "friends"}, {ownerID: user.id}] }, {score: { $meta: `textScore` }} )
                .sort({score: {$meta: `textScore`}})
                .exec(function (err, artifacts) {
                    if (err) {
                        return res.status(400).send("Error: Search function has failed. Try again later.");
                    }
                    return res.status(200).send(artifacts);
                });
        }
    })(req, res, next);
});

// create new artifact
router.post('/newArtifact', (req, res, next) => {

    passport.authenticate('jwt', passportOpts, (err, user, info) => {
        const SERIAL_LENGTH = 24;
        const PASS_LENGTH = 4;

        if (err) { 
            return next(err); 
        }
        if (!user) { 
            return res.status(401).send("Unauthorised user"); 
        }

        // Form validation for add artifact
        const { errors, isValid } = validateAddArtifact(req.body);
        
        // Check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        // Map through each artifact that current exists, and extract the serial number. Then keep generating new serial numbers until you find a unique
        // one to assign
        Artifact.find({}, function(err, artifacts) {

            if (err) {
                return next(err);
            }

            var artifactSerials = [];
            var artifactPasscodes = [];
            
            artifacts.forEach(function (artifact) {
                artifactSerials.push(artifact.serialNumber);
                artifactPasscodes.push(artifact.passcode);
            });
            
            var id = cryptoString({length: SERIAL_LENGTH, characters: CHARACTERS});
            var passcode = cryptoString({length: PASS_LENGTH, characters: CHARACTERS});
            var notUnique = true;

            while(notUnique) {
                if (!artifactSerials.includes(id) && !artifactPasscodes.includes(passcode)) {
                    notUnique = false;
                } else {
                    id = cryptoString({length: SERIAL_LENGTH, characters: CHARACTERS});
                    passcode = cryptoString({length: PASS_LENGTH, characters: CHARACTERS});
                }
            }

            var newArtifact = new Artifact({
                "serialNumber": id,
                "passcode": passcode,
                "name": req.body.name,
                "story": req.body.story,
                "tags": req.body.tags.join(' '),
                "category": req.body.category,
                "isPublic": req.body.isPublic,
                "ownerID": user.id
            });

            // Add dateMade only if it wasn't empty, if it's empty that means user did not specify it
            if (req.body.dateMade) {
                newArtifact.dateMade = req.body.dateMade;
            }
            
            newArtifact.save(function (err, artifact) {
                if (!err) {
                    res.status(200).send(artifact);
                } else {
                    res.status(400).send(err);
                }
            });
        })
    })(req, res, next);
});

// @route GET /artifact/:serial/:passcode
// @desc View a single artifact based on its serial code. Anyone has access to this route and will gain access to the artifact as long as they have the serial number
// and passcode for the artifact.
// @access Public
router.get('/artifact/:serial/:passcode', (req, res) => {

    const serial = req.params.serial;
    const passcode = req.params.passcode;

    Artifact.findOne({serialNumber: serial, passcode: passcode}, (err, artifact) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (!artifact) {
            return res.status(404).send("Error: Artifact not found.");
        }
        return res.status(200).send(artifact);
    })

});

// @route GET /artifact/:artifactID
// @desc View a single artifact based on its unique database ID. Only the artifact owner and authorised users are allowed
//       to view via this URL.
// @access Restricted
router.get('/artifact/:artifactID', (req, res, next) => { 
    passport.authenticate('jwt', passportOpts, (err, user, info) => {

        var artifactID = req.params.artifactID;

        if (err) {
            return next(err);
        }

        Artifact.findById(artifactID, function(err, artifact) {
            if (err) {
                return res.status(400).send(err);
            }

            // Check that the artifact exists
            if (!artifact) {
                return res.status(404).send("Artifact not found.");
            }

            // Check if non-logged in user
            if (!user) {
                // Check if its not public
                if (artifact.isPublic !== 'public') {
                    return res.status(401).send("Unauthorised user. You are not allowed to view this resource.");
                } else {
                    return res.status(200).send(artifact);
                }
            }
            
            // Check if owner of the artifact, can view it regardless of privacy settings.
            if (artifact.ownerID.includes(user.id)) {
                return res.status(200).send(artifact);
            } else {
                // Check if it a known user to the owner of the artifact.
                User.findById(artifact.ownerID[0], function(err, owner) {

                    if (err) {
                        return res.status(400).send(err);
                    }

                    if (owner.knownUsers !== null && typeof(owner.knownUsers) !== "undefined") {
                        // Check to make sure it isn't null before accessing
                        if (owner.knownUsers.includes(user.email)) {
                            // Check the privacy setting
                            if (artifact.isPublic === 'friends') {
                                return res.status(200).send(artifact);
                            } else if (artifact.isPublic === 'public') {
                                return res.status(200).send(artifact);
                            } else {
                                return res.status(401).send("This artifact is private. Ask the owner to change the privacy.");
                            }
                        } else {
                            if (artifact.isPublic === 'public') {
                                return res.status(200).send(artifact);
                            } else {
                                return res.status(401).send("You are not the owner or a known user. So you are not allowed to view this resource.");
                            }
                        }
                    } else {
                        return res.status(401).send("You are not the owner or a known user. So you are not allowed to view this resource.");
                    }
                });
            }
        })
    })(req, res, next);
});

// @route DELETE /delete_artifact/:artifactID
// @desc View a single artifact based on its serial number.
// @access Restricted
router.delete('/delete_artifact/:artifactID', (req, res, next) => {

    passport.authenticate('jwt', passportOpts, (err, user, info) => {
        
        if (err) { 
            return next(err); 
        }
        if (!user) { 
            return res.status(401).send("Unauthorised user, you are not the owner of this artifact."); 
        }

        var artifactID = req.params.artifactID;
        Artifact.findById(artifactID, (err, artifact) => {

            if (err) {
                return res.status(500).send(err);
            }

            if (!artifact) {
                return res.status(404).send("Artifact not found.");
            }

            // Check if owner of the artifact, can then delete it
            if (artifact.ownerID.includes(user.id)) {
                // Delete all images associated
                artifact.images.forEach((objectID) => {
                    imgStore.deleteImage(objectID, (err, result) => {
                        if (err) {
                            console.error(err);
                            if (!res.headersSent) {
                                return res.status(500).send(err);
                            }
                        }
                        if (result) {
                            console.log("Deleted Image: ", objectID);
                        } else {
                            console.log("Delete Image failed for: ", objectID);
                        }
                    });
                });
                // Delete all videos associated
                artifact.videos.forEach((objectID) => {
                    vidStore.deleteVideo(objectID, (err, result) => {
                        if (err) {
                            console.error(err);
                            if (!res.headersSent) {
                                return res.status(500).send(err);
                            }
                        }
                        if (result) {
                            console.log("Deleted Video: ", objectID);
                        } else {
                            console.log("Delete Video failed for: ", objectID);
                        }
                    });
                });
                Artifact.findOneAndDelete({_id:artifactID}, function(err, doc) {
                    if(!err){
                        res.status(200).send("Delete successful.");
                    } else {
                        res.status(500).send(err);
                    }
                });
            } else {
                // Unauth user
                return res.status(401).send("Unauthorised user, you are not the owner of this artifact."); 
            }
        });
    })(req, res, next);
});

// @route GET /video/:iv/:enc
// @desc Views single video based on its object ID in MongoDB. Access is restricted as this video is only accessible on 
// the artifact page that it is on. 
// IV is the initialisation vector and ENC is the actual encrypted data. Both must be passed in the URL to correctly
// access the video
// @access Restricted
router.get('/video/:iv/:enc', (req, res) => {

    // Here are the encrypted parameters passed from the server to decrypt and
    // get the object ID of the video, thus preventing any access to videos even with knowledge
    // of the object ID as they would have to encrypt it first before it would be processed properly.
    try {
        const objID = decrypt({iv: req.params.iv, encryptedData: req.params.enc});
        // See if it's a local media object first
        Media.findById(objID, (err, media) => {
            if (err) {
                return res.status(500).send(err);
            }

            // Check if it exists in media collection
            if (media) {
                vidStore.streamLocalVideo(media.filePath, req, res);
            } else {
                vidStore.streamVideo(objID, req, res);
            }
        });
    } catch (err) {
        return res.sendStatus(401);
    }
});

// @route GET /artifact_images/:artifactID/:imageID
// A GET route that returns a base64 string for the given image ID. Artifact ID must also be supplied to check for
// user authentication as access to these images is restricted depending on user privacy settings.
// access Restricted
router.get('/artifact_images/:artifactID/:imageID', (req, res, next) => {

    const artifactID = req.params.artifactID;
    const imageID = req.params.imageID;

    Artifact.findById(artifactID, (err, artifact) => {

        if (err) {
            return res.sendStatus(500);
        }

        if (!artifact) {
            return res.status(404).send("Error: This image is not associated with an artifact.");
        }

        passport.authenticate('jwt', passportOpts, (err, user, info) => {

            if (err) {
                return res.status(500).send(err);
            }

            // Read the image and determine whether or not send it depending on user authentication
            imgStore.readImage(imageID, function(err, imgData) {
                if (err) {
                    return res.status(500).send(err);
                }

                // Check if non-logged in user
                if (!user) {
                    // Check if its not public
                    if (artifact.isPublic !== 'public') {
                        return res.status(401).send("Unauthorised user. You are not allowed to view this resource.");
                    } else {
                        return res.status(200).send(imgData);
                    }
                }

                // Check if owner of the artifact, can view it regardless of privacy settings.
                if (artifact.ownerID.includes(user.id)) {
                    return res.status(200).send(imgData);
                } else {
                    // Check if it a known user to the owner of the artifact.
                    User.findById(artifact.ownerID[0], function(err, owner) {

                        if (err) {
                            return res.status(400).send(err);
                        }

                        if (owner.knownUsers !== null && typeof(owner.knownUsers) !== "undefined") {
                            // Check to make sure it isn't null before accessing
                            if (owner.knownUsers.includes(user.email)) {
                                // Check the privacy setting
                                if (artifact.isPublic === 'friends') {
                                    return res.status(200).send(imgData);
                                } else if (artifact.isPublic === 'public') {
                                    return res.status(200).send(imgData);
                                } else {
                                    return res.status(401).send("This artifact image is private. Ask the owner to change the privacy.");
                                }
                            } else {
                                if (artifact.isPublic === 'public') {
                                    return res.status(200).send(imgData);
                                } else {
                                    return res.status(401).send("You are not the owner or a known user. So you are not allowed to view this resource.");
                                }
                            }
                        } else {
                            return res.status(401).send("You are not the owner or a known user. So you are not allowed to view this resource.");
                        }
                    });
                }
            });
        })(req, res, next);
    });
});

module.exports = router;