// This utility assist with setting and delting the Authorisation header for our axios requests 
// corresponding to whether the user is logged in or not

import axios from "axios";

const setAuthToken = (token) => {
    if (token) {
        // Apply authorisation token to every request if logged in
        axios.defaults.headers.common["Authorization"] = token;
    } else {
        // Delete the auth header
        delete axios.defaults.headers.common["Authorization"];
    }
};

export default setAuthToken;
