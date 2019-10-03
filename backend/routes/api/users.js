// This file contains the routes that the server backend will provide regarding all user actions

const express = require("express");
const router = express.Router();
const encrypt = require('../../config/encryption').encrypt;
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const imgStore = require('../../storageEngines/imageStorageEngine');

// Import the stuff required to upload profile images
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const cryptoString = require("crypto-random-string");

// Load the input validator
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load up the User module
const User = require("../../models/User");

// Imports required for securing the routes. Allows passport to verify the JWT sent by the client. 
// Requires the user model so make sure you load this after
const passport = require('passport');
require("../../config/passport")(passport);
const passportOpts = {
    session: false
};

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
    // Form validation
    const {errors, isValid} = validateRegisterInput(req.body);
    // Check the validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // Find the user by email
    User.findOne({ email: req.body.email }).then( user => {
        if (user) {
            return(res.status(400).json({email: "Email already exists."}));
        } else {
            const newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                publicName: req.body.publicName,
                email: req.body.email,
                password: req.body.password,
                birthDate: req.body.birthDate
            });

            newUser
                .save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
        }
    });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
    // Form validation for login
    const { errors, isValid } = validateLoginInput(req.body);
    
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find the user by the email they have given
    User.findOne({ email }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({emailnotfound: "Email not found"});
        }
        
        // If user exists, check their password next
        const isMatch = user.isValidPassword(password);
        if (isMatch) {
            const fullName = user.publicName;
            const payload = {
                id: encrypt(user.id),
                name: fullName,
                email: user.email
            };
            
            // Now sign the token with the secret and user info
            jwt.sign(
                payload,
                keys.secretOrKey,
                {
                    expiresIn: 3600 // 1 hour in seconds. Up to you
                },
                (err, token) => {
                    res.json({
                        success: true,
                        token: "Bearer " + token
                    });
                }
            );
        } else {
            // No password match
            return res
                .status(400)
                .json({ passwordincorrect: "Password incorrect" });
        }
    });
});

// @route PATCH api/users/update
// @desc Gets the loggedin users ID from JWT and updates their information. They can change everything but their email. Since we store
// their emails in other users as well which means we need to update those as well.
// @access Private
router.patch('/update', (req, res, next) => {

    passport.authenticate('jwt', passportOpts, (err, user, info) => {

        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(401).send("Unauthorised user. Please login to update details.");
        }

        // Check if its empty, if empty don't update. TODO add a validator here.
        if (req.body.firstName) {
            user.firstName = req.body.firstName;
        }
        if (req.body.lastName) {
            user.lastName = req.body.lastName;
        }
        if (req.body.publicName) {
            user.publicName = req.body.publicName;
        }
        if (req.body.knownUsers) {
            // Append a new email. Validate the string here to be a single email. Two emails will not be allowed.
            user.knownUsers.push(req.body.knownUsers);
        }
        user.save();
        return res.status(201).send("Profile successfully updated.");
    })(req, res, next);
});

// @route POST api/users/upload_profile_image
// @desc Uploads the profile image for the user. Only the user themselves can update their profile picture. Also checks if
// there is already an image existing, if so, deletes it and replaces it with the new one.
// @access Restricted
router.post('/upload_profile_image', (req, res, next) => {
    passport.authenticate('jwt', passportOpts, (err, user, info) => {

        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(401).send("Unauthorised user. Please login to update profile image.");
        }

        // Set up form for receiving the data
        var form = new formidable.IncomingForm();

        // Set the options
        const MB = 1024*1024;
        const MAXFILESIZE = 1 * MB;
        const FILENAMELEN = 16;
        const CHARS = "123456789abcdedfghijklmnopqrstuvwxyz";

        form.uploadDir = './upload';
        form.keepExtensions = true;
        form.multiples = true;
        form.maxFileSize = MAXFILESIZE;

        // Events to respond to

        form.on('file', function(field, file) {
            const NEWPATH = form.uploadDir + "/" + cryptoString({length: FILENAMELEN, characters: CHARS}) + path.extname(file.name);
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

                // Check if user already has an avatarImg
                if (user.avatarImg) {
                    const oldAvatarImg = user.avatarImg;
                    imgStore.deleteImage(oldAvatarImg, (err, result) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).send(err);
                        }

                        if (result) {
                            // On success assign new image
                            user.avatarImg = file._id;
                            user.save()
                                .then(() => {
                                    if (!res.headersSent) {
                                        return res.status(200).send({message: "Profile image added successfully."});
                                    }
                                })
                                .catch(err => {
                                    console.err(err);
                                    if (!res.headersSent) {
                                        return res.status(500).send(err)
                                    }
                                });
                        } else {
                            if (!res.headersSent) {
                                return res.status(400).send({message: "Profile image upload failed."})
                            }
                        }
                    })
                } else {
                    user.avatarImg = file._id;
                    user.save()
                        .then(() => {
                            if (!res.headersSent) {
                                return res.status(200).send({message: "Profile image added successfully."});
                            }
                        })
                        .catch(err => {
                            console.err(err);
                            if (!res.headersSent) {
                                return res.status(500).send(err)
                            }
                        });
                }

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

// @route GET api/users/profile/:email
// @desc Gets the profile image for the user with the provided email. Profile pictures are public, so everyone is
// allowed access to this route.
// @access Public
router.get('/profile/:email', function(req, res) {

    const userEmail = req.params.email;

    User.findOne({email: userEmail}, function(err, user) {
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        }

        if (!user) {
            return res.status(404).send("Error: User not found.");
        }
        // Convert to base64 then send
        imgStore.readImage(user.avatarImg, function(err, content) {
            if (err) {
                return res.status(500).send("Error: Unable to retrieve image from database");
            }
            return res.status(200).send(content);
        });
    });
});


module.exports = router;