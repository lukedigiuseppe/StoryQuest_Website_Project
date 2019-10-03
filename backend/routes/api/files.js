// This file contains routes associated with the management of files after they have been uploaded. Primarily deletion of images and videos, as well as unlinking them.
const express = require("express");
const router = express.Router();

const User = require("../../models/User");
const Artifact = require("../../models/Artifact");
const vidStore = require("../../storageEngines/videoStorageEngine");
const imgStore = require("../../storageEngines/imageStorageEngine");

// Need this to decrypt the video ID
const decrypt = require("../../config/encryption").decrypt;

const passport = require('passport');
require("../../config/passport")(passport);
const passportOpts = {
    session: false
};

// @route POST /delete_video/:artifactID
// @desc Deletes the video associated with the artifact ID given in the URL
// @access Restricted
router.post('/delete_video/:artifactID', (req, res, next) => {

    const artifactID = req.params.artifactID;

    passport.authenticate('jwt', passportOpts, (err, user, info) => {

        if (err) {
            return res.status(500).send(err);
        }

        if (!user) {
            return res.sendStatus(401);
        }

        Artifact.findById(artifactID, (err, artifact) => {
        
            if (err) {
                return res.status(500).send(err);
            }

            if (!artifact) {
                return res.status(404).send("Artifact not found.");
            }

            // Check that the user owns the artifact for which the video is being deleted.
            if (artifact.ownerID.includes(user.id)) {
                // Decrypt the video ID received in the body
                try {
                    const videoID = decrypt(req.body);
                    vidStore.deleteVideo(videoID, (err, result) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        if (result) {
                            // Also unlink it from the artifact
                            var index = artifact.videos.indexOf(videoID);
                            if (index > -1) {
                                // Greater than -1 means, that video ID was found successfully
                                artifact.videos.splice(index, 1);
                            }
                            artifact.save()
                                .catch(err => {
                                    throw err;
                                });
                            return res.status(200).send("Video delete successful.");
                        } else {
                            // If an error wasn't triggered, then the only unsuccessful result would be from the video not existing
                            return res.status(404).send("Video not found");
                        }
                    })
                } catch (err) {
                    console.error(err);
                    return res.sendStatus(400);
                }
            } else {
                return res.status(401).send("Unauthorised user. You are not allowed to delete this object.");
            }
        });
    })(req, res, next);
})

// @route DELETE /delete_video/:artifactID/:imageID
// @desc Deletes the image associated with the artifact ID given in the URL
// @access Restricted
router.delete('/delete_image/:artifactID/:imageID', (req, res, next) => {
    const artifactID = req.params.artifactID;
    const imageID = req.params.imageID;

    passport.authenticate('jwt', passportOpts, (err, user, info) => {
        
        if (err) {
            return res.status(500).send(err);
        }

        if (!user) {
            return res.sendStatus(401);
        }

        Artifact.findById(artifactID, (err, artifact) => {
        
            if (err) {
                return res.status(500).send(err);
            }

            if (!artifact) {
                return res.status(404).send("Artifact not found.");
            }

            // Check that the user owns the artifact for which the image is being deleted.
            if (artifact.ownerID.includes(user.id)) {
                imgStore.deleteImage(imageID, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    if (result) {
                        // Also unlink it from the artifact
                        var index = artifact.images.indexOf(imageID);
                        if (index > -1) {
                            // Greater than -1 means, that image ID was found successfully
                            artifact.images.splice(index, 1);
                        }
                        artifact.save()
                            .catch(err => {
                                throw err;
                            });
                        return res.status(200).send("Image delete successful.");
                    } else {
                        // If an error wasn't triggered, then the only unsuccessful result would be from the image not existing
                        return res.status(404).send("Image not found");
                    }
                })
            } else {
                return res.status(401).send("Unauthorised user. You are not allowed to delete this object.");
            }
        });
    })(req, res, next);
});

module.exports = router;