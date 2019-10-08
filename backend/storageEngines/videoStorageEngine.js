// This file contains an interface to functions dealing with the storage as well as streaming of videos.

const { createReadStream, stat } = require('fs');
const { createModel } = require('mongoose-gridfs');
// Import the global mongoose connection that should be connected by server.js
const connection = require('mongoose').connection;
const path = require('path');
const mime = require('mime-types');

// Import Media collection to delete those
const Media = require("../models/Media");

// Create a new GridFS bucket to hold the files to be uploaded to MongoDB, ensure connection has been made before doing
// anything

var VidModel = null;
module.exports.init = connection.once('open', () => {
    VidModel = createModel({
        modelName: 'videos',
        connection: connection
    });
});

// This function uploads a video to the MongoDB video store and returns the file information upon success. Returns false upon failure. 
// The callback function takes two arguments (err, result).
module.exports.uploadVideo = function uploadVideo(videoPath, filename, callback) {
    const readStream = createReadStream(videoPath);
    const contentType = mime.lookup(path.extname(videoPath));
    if (!contentType) {
        console.error("Not a valid file.");
        callback(new Error("Not a valid file."));
        return;
    }
    // We can possibly alter the filename here using crypto to make it more secure. So files become indistinguishable in the db, except
    // by object ID.
    const options = ({ filename: filename, contentType: contentType});
    VidModel.write(options, readStream, (err, file) => {
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

// This function returns a video stream from the local filesystem given the file path.
// So it requires the req and res objects from Express to be able to stream the video back to the requester
module.exports.streamLocalVideo = function streamLocalVideo(videoPath, req, res) {

    // This is the size (in bytes) of video chunks to be sent across. Optimal size has been tested
    const DEFAULT_CHUNK_SIZE = 3000000;

    stat(videoPath, (err, stats) => {
        if (err) {
            if (!res.headersSent) {
                return res.status(500).send(err);
            }
        }

        // Ensure that file exists
        if (!stats) {
            if (!res.headersSent) {
                return res.status(404).send("No file found!!");
            }
        }

        const videoData = {
            contentType: mime.lookup(path.extname(videoPath)),
            length: stats.size
        };

        //  Check if it's a stream request.
        if (req.headers['range']) {
            // Parse the range header
            var parts = req.headers.range.replace(/bytes=/, "").split("-");
            var partialStart = parts[0];
            var partialEnd = parts[1];

            var start = parseInt(partialStart, 10);
            var end = partialEnd ? parseInt(partialEnd, 10) : start + DEFAULT_CHUNK_SIZE;
            // Don't overshoot the video length and set the remainder of video as the chunk size.
            if (end >= (videoData.length - 1)) {
                end = videoData.length - 1;
            }
            var chunkSize = (end - start) + 1;

            console.log(req.headers.range);
            console.log(start, "-",end);
            // Write out the response range header according to the HTTP spec
            res.writeHead(206, {
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Range': 'bytes ' + start + '-' + end + '/' + videoData.length,
                'Content-Type': videoData.contentType
            });

            // We need to deal with the end specifically since Chrome and Firefox seem to send weird range requests
            // when the video is nearing the end. Maybe due to the single byte we subtracted earlier from the video length.
            if (start === end) {
                const partialStream = createReadStream(videoPath, {
                    start: start,
                    end: videoData.length
                })
                partialStream.pipe(res); 
            } else {
                console.log("Starting stream...");
                const partialStream = createReadStream(videoPath, {
                    start: start,
                    end: end
                })
                partialStream.pipe(res); 
            }
        } else {
            // Send the whole video if it's a download request and so it's not a range request.
            console.log("Download requested...");
            res.header('Content-Length', videoData.length);
            res.header('Content-Type', videoData.contentType);
            const fullStream = createReadStream(videoPath);
            fullStream.pipe(res); 
        }
    });
};

// This function returns a video stream for the specified Mongo object ID. It requires the req and res objects from
// Express to be able to stream the video back to the requester. 
module.exports.streamVideo = function streamVideo(objectID, req, res) {

    // This is the size (in bytes) of video chunks to be sent across. Optimal size has been tested
    const DEFAULT_CHUNK_SIZE = 3000000;

    VidModel.findById(objectID, (err, video) => {
        if (err) {
            console.error(err);
            return res.status(500).send(JSON.stringify(err.toString()));
        }

        if (!video) {
            return res.sendStatus(404);
        }
        
        //  Check if it's a stream request.
        if (req.headers['range']) {
            // Parse the range header
            var parts = req.headers.range.replace(/bytes=/, "").split("-");
            var partialStart = parts[0];
            var partialEnd = parts[1];

            var start = parseInt(partialStart, 10);
            var end = partialEnd ? parseInt(partialEnd, 10) : start + DEFAULT_CHUNK_SIZE;
            // Don't overshoot the video length and set the remainder of video as the chunk size.
            if (end >= (video.length - 1)) {
                end = video.length - 1;
            }
            var chunkSize = (end - start) + 1;

            console.log(req.headers.range);
            console.log(start, "-",end);
            // Write out the response range header according to the HTTP spec
            res.writeHead(206, {
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Range': 'bytes ' + start + '-' + end + '/' + video.length,
                'Content-Type': video.contentType
            });

            // We need to deal with the end specifically since Chrome and Firefox seem to send weird range requests
            // when the video is nearing the end. Maybe due to the single byte we subtracted earlier from the video length.
            if (start === end) {
                VidModel.read({
                    _id: video._id,
                    start: start,
                    end: video.length
                }).pipe(res); 
            } else {
                console.log("Starting stream...");
                VidModel.read({
                    _id: video._id,
                    start: start,
                    end: end
                }).pipe(res); 
            }

        } else {
            // Send the whole video if it's a download request and so it's not a range request.
            console.log("Download requested...");
            res.header('Content-Length', video.length);
            res.header('Content-Type', video.contentType);
            VidModel.read({_id: video._id}).pipe(res); 
        }
    });
};

// This function deletes a video stored in MongoDB given its MongoDB object ID. Requires a callback function
// with the following signature (err, result). Result is a boolean value that is set to true upon deletion success and false otherwise.
module.exports.deleteVideo = function deleteVideo(objectID, callback) {

    VidModel.findById(objectID, (err, video) => {
        if (err) {
            console.error(err);
            return callback(err, false);
        }

        if (video) {
            VidModel.unlink(objectID, (err) => {
                if (err) {
                    console.error(err);
                    return callback(err, false);
                }
                return callback(null, true);
            });
        } else {
            // If we can't find it in video collection for GridFS, check media collection
            Media.findOneAndDelete({_id: objectID}, (err, media) => {
                if (err) {
                    console.error(err);
                    return callback(err, false);
                }

                // If media exists, means delete was successful, otherwise video ID must be invalid
                if (media) {
                    // Remove the local file
                    fs.unlink(media.filePath, (err) => {
                        if (err) {
                            return callback(err, false);
                        }
                    });
                    return callback(null, true);
                } else {
                    return callback(null, false);
                }
            })
        }
    });
};