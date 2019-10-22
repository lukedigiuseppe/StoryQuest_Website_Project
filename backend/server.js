// This is the main server file that pulls in the required dependencies, applies middleware and starts the server.

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");

// Pull in the routes that users will need to access
const users = require("./routes/api/users");
const artifacts = require("./routes/api/artifacts");
const upload = require("./routes/api/upload");
const files = require("./routes/api/files");

const app = express();

// Set domain restricitions here. For Cross-Origin Policy.
app.use(cors());

// Bodyparser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

var db = null;
var name = null;

// DB config for dev and production environments
if (process.env.NODE_ENV !== "test") {
    db = require("./config/keys").mongoURI;
    name = require("./config/keys").dbName;
    // Only use morgan logging in all modes other than testing, otherwise it interferes with testing output
    app.use(morgan('combined'));
} else {
    db = require("./config/keys").testMongoURI;
    name = require("./config/keys").testDBName;
}

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
    .then( () => {
        console.log("MongoDB successfully connected.");
    })
    .catch( err => console.log(err));

// Add in passport to the backend server as middleware
app.use(passport.initialize());

// Make passport use our config setup
require("./config/passport")(passport);

// Routes. So we would specify localhost:5000/api/users to access the routes defined in "users.js"
app.use("/api/users", users);
app.use("/", artifacts);
app.use("/", upload);
app.use("/", files);

// process.env.PORT is Heroku's port since we chose to deploy the APP there
const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server up and running on port ${port}!`));

// Export is used only for testing purposes.
module.exports = app;