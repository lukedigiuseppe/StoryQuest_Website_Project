// This file contains the routes that the server backend will provide regarding all artifact actions

const express = require("express");
const router = express.Router();
const Artifact = require("../../models/Artifact");

// Imports required for securing the routes. Allows passport to verify the JWT sent by the client.
const passport = require('passport');
require("../../config/passport")(passport);
const passportOpts = {
    session: false
};

// @route /artifacts
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

// This is dev route. REMOVE IN FINAL BUILD
// router.get('/getartifactids', function(req, res) {

    // passport.authenticate('jwt', passportOpts, function(req, res) {
        // Artifact.find({}, function(err, artifacts) {
        //     var artifactSerials = [];
    
        //     artifacts.forEach(function (artifact) {
        //         artifactSerials.push(artifact.serialNumber);
        //     });
    
        //     res.send(artifactSerials);
        // })
    // });
// })

router.get('/findUser', (req, res, next) => {
    passport.authenticate('jwt', passportOpts, (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { return res.send("Doesn't work"); }
        return res.send("Hey, its working.");
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
                "story": req.body.story,
                "category": req.body.category,
                "keywords": req.body.keywords,
                "ownerID": user.id,
                "isPublic": req.body.isPublic
            });

            newArtifact.save(function (err, artifact) {
                if (!err) {
                    res.send(artifact);
                } else {
                    res.status(400).send("There was an error creating the artifact. Please try again later.");
                }
            });
        })
    })(req, res, next);
});

// @route /artifacts
// @desc View a single artifact based on its serial number.
// @access Public
router.get('/artifact/:artifactID', (req, res, next) => { 
    Artifact.findById(req.params.artifactID, function(err,artifact){
        if (!err) {
            res.send(artifact);
        } else {
            res.sendStatus(400);
        }
    });
});

//delete artifact
router.delete('/artifact/:serialID', (req,res) => {
    var artifactSerialNumber = req.params.serialID;
    Artifact.findOneAndDelete({name:artifactSerialNumber}, function(err,doc){
        if(!err){
            res.send(doc);
        }else{
            res.sendStatus(404);
        }
    });
});

module.exports = router;

