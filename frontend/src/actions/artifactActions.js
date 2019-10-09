// This file contains the logic for posting the add artifact form data to the backend server
import axios from "axios";

import {
    GET_ERRORS
} from "./types";

// Axios POST request to backend to create the new artifact. The callback is just an function that takes the response data 
// and runs on request completion.
export const addNewArtifact = (artifactData, callback) => dispatch => {
    axios
        .post('/newArtifact', artifactData)
        .then(res => {
            // Run the callback routine and pass the response data
            callback(res);
        })
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
        );
};


