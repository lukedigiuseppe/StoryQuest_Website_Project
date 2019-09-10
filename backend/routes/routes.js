var express = require('express');
var router = express.Router();
//view homepage
router.get('/',controller.index);

// Register new user
router.post('/user/register',userController.register);
// User Login
router.post('/user/login',userController.login);
// User Logout new
router.post('/user/logout',userController.logout);
//get all usernames
router.get('/users',userController.getAllUsers);


//get all artifacts
router.get('/artifacts',artifactController.getAllArtifacts);
// create new artifact
router.get('/newArtifact',artifactController.registerArtifacts);
//view one artifact by ID
router.get('/artifacts/:artifactID',artifactController.registerArtifacts);
//delete artifact
router.delete('/artifacts/artifactID',artifactController.deleteArtifact);