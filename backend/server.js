var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Not needed in new version of express
// app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
//const path = require('path');


require('dotenv').config();
app.use(cors());

// Database setup
require('./models/db.js');

//Start the server, listen at port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, function(){
    console.log('Express serving on port ${PORT}');
});


//load view engine
app.use(express.static(path.join(__dirname, '../public')));
app.set('view engine', 'html');