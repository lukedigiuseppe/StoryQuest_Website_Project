// This is the main server file that pulls in the required dependencies, applies middleware and starts the server.

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

// Pull in the routes that users will need to access
const users = require("./routes/api/users");
const artifacts = require("./routes/api/artifacts");

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
const name = require("./config/keys").dbName;

// Connect to MongoDB
mongoose
    .connect(
        db, { 
            useNewUrlParser: true, 
            useCreateIndex: true,
            dbName: name,
            useUnifiedTopology: true // This is needed to remove the deprecation warning for Server discovery and monitoring in nodemon
        }
    )
    .then( () => console.log("MongoDB successfully connected."))
    .catch( err => console.log(err));

// Add in passport to the backend server as middleware
app.use(passport.initialize());

// Make passport use our config setup
require("./config/passport")(passport);

// Routes. So we would specify localhost:5000/api/users to access the routes defined in "users.js"
app.use("/api/users", users);
app.use("/", artifacts);

// process.env.PORT is Heroku's port if we choose to deploy the APP there
const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server up and running on port ${port}!`));
