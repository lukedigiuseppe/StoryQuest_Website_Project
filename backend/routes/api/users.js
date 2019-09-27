// This file contains the routes that the server backend will provide regarding all user actions

const express = require("express");
const router = express.Router();
const encrypt = require('../../config/encryption').encrypt;
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const imgStore = require('../../storageEngines/imageStorageEngine');

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
                name: fullName
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

// Test function to get the profile image of a user.
router.get('/profile/:email', function(req, res) {

    const userEmail = req.params.email;

    User.findOne({email: userEmail}, function(err, user) {
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        }
        // Convert to base64 then send
        const binData = imgStore.readImage(user.avatarImg);
        if (!binData) {
            return res.status(500).send("Error: Unable to retrieve image from database");
        }
        const img64 = new Buffer.from(binData, 'binary').toString('base64');
        return res.status(200).send(img64);
    })
})

module.exports = router;