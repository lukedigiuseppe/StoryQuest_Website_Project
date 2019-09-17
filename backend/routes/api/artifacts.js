// This file contains the routes that the server backend will provide regarding all artifact actions

const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const Artifact = require("../../models/Artifact");

router.get('/artifacts', function (req, res) {
    Artifact.find(function (err, artifact) {
        if (!err) {
            res.send(artifact);
        } else {
            res.sendStatus(404);
        }
    });
});


// create new artifact - TO DO: Link owner with artifact (owner email or owner DB ID?) + SerialNum
router.post('/newArtifact', (req,res) => {

    var newArtifact = new Artifact({
        "serialNumber": req.body.serialNumber,
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

