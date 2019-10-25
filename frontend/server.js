// A simple Node/Express server to run the React app when it is deployed to Heroku otherwise we use react-start scripts to run a dev server

const express = require('express');
const favicon = require('express-favicon');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();
app.use(favicon(__dirname + '/build/favicon.ico'));
// the __dirname is the current directory from where the server is running
app.use(express.static(__dirname));
// Serve files based on the built, optimised versions rather than straight from the source.
app.use(express.static(path.join(__dirname, 'build')));

// A simple, little route for testing that server is running
app.get('/ping', function (req, res) {
 return res.send('pong');
});


app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port);