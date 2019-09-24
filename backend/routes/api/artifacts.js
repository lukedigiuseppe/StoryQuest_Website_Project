// This file contains the routes that the server backend will provide regarding all artifact actions

const express = require("express");
const router = express.Router();
const Artifact = require("../../models/Artifact");
const User = require("../../models/User");

// Imports required for securing the routes. Allows passport to verify the JWT sent by the client.
const passport = require('passport');
require("../../config/passport")(passport);
const passportOpts = {
    session: false
};

// @route GET /artifacts
// @desc View all public artifacts
// @access Public
router.get('/artifacts', function (req, res) {
    Artifact.find({isPublic: true}, function (err, artifact) {
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
            Artifact.find({$text: { $search: req.body.searchString }, isPublic: true}, {score: { $meta: `textScore` }} )
                .sort({score: {$meta: `textScore`}})
                .exec(function(err, artifacts) {
                    if (err) {
                        return res.status(400).send("Error: Search function has failed. Try again later.");
                    }
                    return res.send(artifacts);
                });
        } else {
            // Otherwise they are allowed to search for public artifacts, plus the ones they have created
            Artifact.find({$text: { $search: req.body.searchString }, $or: [ {isPublic: true}, {ownerID: user.id}] }, {score: { $meta: `textScore` }} )
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

// This function generates a random string filled with 'characters' up to a specified 'length'
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
 
// create new artifact
router.post('/newArtifact', (req, res, next) => {

    passport.authenticate('jwt', passportOpts, (err, user, info) => {
        const SERIAL_LENGTH = 6;

        if (err) { 
            return next(err); 
        }
        if (!user) { 
            return res.status(401).send("Unauthorised user"); 
        }

        // Map through each artifact that current exists, and extract the serial number. Then keep generating new serial numbers until you find a unique
        // one to assign
        Artifact.find({}, function(err, artifacts) {
            var artifactSerials = [];
            
            artifacts.forEach(function (artifact) {
                artifactSerials.push(artifact.serialNumber);
            });
            
            var id = makeid(SERIAL_LENGTH);
            var notUnique = true;

            while(notUnique) {
                if (!artifactSerials.includes(id)) {
                    notUnique = false;
                } else {
                    id = makeid(SERIAL_LENGTH);
                }
            }

            var newArtifact = new Artifact({
                "serialNumber": id,
                "name": req.body.name,
                "story": req.body.story,
                "category": req.body.category,
                "keywords": req.body.keywords,
                "ownerID": user.id,
                "isPublic": req.body.isPublic
            });

            newArtifact.save(function (err, artifact) {
                if (!err) {
                    res.status(200).send(artifact);
                } else {
                    res.status(400).send("There was an error creating the artifact. Please try again later.");
                }
            });
        })
    })(req, res, next);
});


// Helper function to determine if this is a user's friend/family member etc.
// artifactID is the owner of the artifact being checked
// userEmail is the email of the unknown user to be checked
// Returns true if user is friend of owner, otherwise false.
function isUserFriend(artifactID, userEmail) {

    Artifact.findById(artifactID, function(err, artifact) {
        // If there is an error print to console but don't crash the app. Just return false by default.
        if (err) {
            console.error(err);
            return false;
        }

        User.findById(artifact.ownerID[0], function(err, user) {
            if (err) {
                console.error(err);
                return false;
            }
            if (user.knownUsers !== null && typeof(user.knownUsers) !== "undefined") {
                // Check to make sure it isn't null before accessing
                if (user.knownUsers.includes(userEmail)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        });
    });
};

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

        // Check if non-logged in user
        if (!user) {
            return res.status(401).send("Unauthorised user. You are not allowed to view this resource.");
        }

        Artifact.findById(artifactID, function(err, artifact) {
            if (err) {
                return res.status(400).send(err);
            }

            // Check if owner of the artifact
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
                            return res.status(200).send(artifact);
                        } else {
                            return res.status(401).send("You are not the owner or a known user. So you are not allowed to view this resource.");
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
        Artifact.findOneAndDelete({_id:artifactID}, function(err, doc) {
            if(!err){
                res.status(200).send("Delete successful.");
            }else{
                res.status(400).send(err);
            }
        });
    })(req, res, next);
});

module.exports = router;