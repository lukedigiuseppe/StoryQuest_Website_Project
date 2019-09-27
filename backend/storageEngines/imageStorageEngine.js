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
    });
});

// This function uploads an image to the MongoDB image store and returns the file information upon success. Returns false upon failure.
module.exports.upload = function upload(imagePath, filename) {

    connection.once('open', () => {
        const readStream = createReadStream(imagePath);
        const contentType = mime.lookup(path.extname(imagePath));
        if (!contentType) {
            console.error(Error("Not a valid image file."));
            return false;
        }
        // We can possibly alter the filename here using crypto to make it more secure. So files become indistinguishable in the db, except
        // by object ID.
        const options = ({ filename: filename, contentType: contentType});
        ImgBucket.write(options, readStream, (err, file) => {
            if (err) {
                console.error(err);
                return false;
            }
            console.log(file);
            return file;
        });
    });
};

// This function returns the image file for the specified Mongo object ID. Returns false on failure.
module.exports.readImage = function readImage(objectID) {

    connection.once('open', () => {
        ImgBucket.findById(objectID, (err, image) => {
            if (err) {
                console.error(err);
                return false;
            }
            image.read(function(err, content) {
                if (err) {
                    console.error(err);
                    return false;
                }
                return content;
            });
        });
    });
};

// This function deletes an image stored in MongoDB given its MongoDB object ID. Returns false on error, true on success
module.exports.deleteImage = function deleteImage(objectID) {

    connection.once('open', () => {
        ImgBucket.unlink(objectID, (err) => {
            if (err) {
                console.error(err);
                return false;
            }
            return true;
        })
    })
};


