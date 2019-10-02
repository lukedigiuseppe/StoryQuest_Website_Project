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

// Test route for deleting a video. Later on will need to update to take in an artifact ID as well to identify that the user 
// is allowed to delete this video
router.post('/delete_video', (req, res) => {
    // Decrypt the video ID received in the body
    const videoID = decrypt(req.body);

    vidStore.deleteVideo(videoID, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        return res.sendStatus(200);
    })
})

module.exports = router;