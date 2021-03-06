// This file contains an interface to storing images using GridFS into MongoDB

const { createReadStream } = require('fs');
const { createModel } = require('mongoose-gridfs');
// Import the global mongoose connection that should be connected by server.js
const connection = require('mongoose').connection;
const path = require('path');
const mime = require('mime-types');

// Create a new GridFS bucket to hold the files to be uploaded to MongoDB, ensure connection has been made before doing
// anything

var ImgBucket = null;
module.exports.init = connection.once('open', () => {
    ImgBucket = createModel({
        modelName: 'images',
        connection: connection
    })
});

// This function uploads an image to the MongoDB image store and returns the file information upon success. Returns false upon failure. 
// The callback function takes two arguments (err, result).
module.exports.upload = function upload(imagePath, filename, callback) {
    const readStream = createReadStream(imagePath);
    const contentType = mime.lookup(path.extname(imagePath));
    if (!contentType) {
        console.error("Not a valid file.");
        callback(new Error("Not a valid file."));
        return;
    }
    // We can possibly alter the filename here using crypto to make it more secure. So files become indistinguishable in the db, except
    // by object ID.
    const options = ({ filename: filename, contentType: contentType});
    ImgBucket.write(options, readStream, (err, file) => {
        if (err) {
            console.error(err);
            callback(new Error(err));
            return;
        }
        console.log(file);
        callback(null, file);
        return;
    });
};

// This function returns the image file for the specified Mongo object ID. It requires a callback function
// with the following signature (err, content).
module.exports.readImage = function readImage(objectID, callback) {
    ImgBucket.findById(objectID, (err, image) => {
        if (err) {
            console.error(err);
            callback(err);
            return;
        }

        // Check if image is null
        if (!image) {
            var error = new Error("Image not found.");
            callback(error);
            return;
        }

        // Stream data from MongoDB
        const readStream = image.read();
        var buffer = "";
        readStream.on('data', (data) => {
            // Convert it bit by bit to base64 and append to our buffer
            const imgData = new Buffer.from(data, 'binary').toString('base64');
            buffer += imgData
        });

        readStream.on('close', () => {
            callback(null, buffer);
            return;
        })
    });
};

// This function deletes an image stored in MongoDB given its MongoDB object ID. Requires a callback function
// with the following signature (err, result)
module.exports.deleteImage = function deleteImage(objectID, callback) {
    ImgBucket.findById(objectID, (err, image) => {

        if (err) {
            console.error(err);
            return callback(err, false);
        }

        if (!image) {
            console.log("No Image found.");
            return callback(null, false);
        }

        ImgBucket.unlink(objectID, (err) => {
            if (err) {
                console.error(err);
                return callback(err, false);
            }
            return callback(null, true);
        });
    })
    
};