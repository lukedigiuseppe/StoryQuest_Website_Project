// This is the main server file that pulls in the required dependencies, applies middleware and starts the server.

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

// Pull in the routes that users will need to access
const users = require("./routes/api/users");

const app = express();

// Bodyparser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

// DB config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
    .connect(
        db,
        { useNewUrlParser: true }
    )
    .then( () => console.log("MongoDB successfully connected."))
    .catch( err => console.log(err));

// Add in passport to the backend server as middleware
app.use(passport.initialize());

// Make passport use our config setup
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);

// process.env.PORT is Heroku's port if we choose to deploy the APP there
const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server up and running on port ${port}!`));
