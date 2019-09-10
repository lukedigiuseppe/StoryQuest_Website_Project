var mongoose = require('mongoose');
const views = require('../public/views.js');


var index = function(req,res){
    res.render('index.html');
};

module.exports.index = index;