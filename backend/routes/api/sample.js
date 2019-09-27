const express = require("express");
const router = express.Router();
const User = require("../../models/User");

const passport = require('passport');
require("../../config/passport")(passport);
const passportOpts = {
    session: false
};

router.post('/sample', (req, res, next) => {
    passport.authenticate('jwt', passportOpts, (err, user, info) => {

        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(401).send("Unauthorised user. Please login to update details.");
        }

        const sentData = {
            field1: req.body.field1,
            field2: req.body.field2,
            field3: req.body.field3
        }

        return res.status(200).send(sentData);

    })(req, res, next);
});

router.get('/userinfo', (req, res, next) => {
    passport.authenticate('jwt', passportOpts, (err, user, info) => {

        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(401).send({message: "Unauthorised user. Please login to update details."});
        }

        User.findById(user.id, function(err, user) {

            if (err) {
                return res.status(400).send({message: err});
            }

            return res.status(200).send(user);
        });
    })(req, res, next);
});

module.exports = router;