// This file contains the routes that the server backend will provide regarding all artifact actions

const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const Artifact = require("../../models/Artifact");

const passport = require('passport');
require("../../config/passport")(passport);
const passportOpts = {
    session: false
};

router.get('/artifacts', function (req, res) {
    Artifact.find(function (err, artifact) {
        if (!err) {
            res.send(artifact);
        } else {
            res.sendStatus(404);
        }
    });
});

router.get('/findUser', (req, res, next) => {
    passport.authenticate('jwt', passportOpts, (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { return res.send("Doesn't work"); }
        return res.send("Hey, its working.");
    })(req, res, next);
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
 
// create new artifact - TO DO: Link owner with artifact (owner email or owner DB ID?)
router.post('/newArtifact', (req,res) => {

    // Map through each artifact that current exists, and extract the serial number. Then keep generating new serial numbers until you find a unique
    // one to assign
    Artifact.find({}, function(err, artifacts) {
        var artifactSerials = [];
        
        artifacts.forEach(function (artifact) {
            artifactSerials.push(artifact.serialNumber);
        });
        
        var id = makeid(6);
        var notUnique = true;

        while(notUnique) {
            if (!artifactSerials.includes(id)) {
                notUnique = false;
            } else {
                id = makeid(6);
            }
        }

        var newArtifact = new Artifact({
            "serialNumber": id,
            "story": req.body.story,
            "category": req.body.category,
            "keywords": req.body.keywords,
            "ownerID": req.body.ownerID
        });

        newArtifact.save(function (err, artifact) {
            if (!err) {
                res.send(artifact);
            } else {
                res.sendStatus(400);
            }
        });
    })

});
//view one artifact by ID
router.get('/artifact/:artifactID', (req,res) =>{
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

