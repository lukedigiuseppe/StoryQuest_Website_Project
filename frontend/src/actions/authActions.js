// This file contains the logic for how authorisation will work in our app. 
// It uses axios to make HTTPrequests within a certain action and then dispatches them to our reducers

import axios from "axios";
import setAuthToken from "../utils/setAuthToken"
import jwt_decode from "jwt-decode";

import {
    GET_ERRORS,
    SET_CURRENT_USER,
    USER_LOADING
} from "./types"

// Register the user
export const registerUser = (userData, history) => dispatch => {
    axios
      .post("/api/users/register", userData)
      .then(res => res.history.push("/login"))
      .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
};

// Login - get user token
export const loginUser = userData => dispatch => {
    axios
        .post("/api/users/login", userData)
        .then(res => {
            // Save it to local storage

            // Set token to localstorage
            const { token } = res.data;
            localStorage.setItem("jwtToken", token);
            // Set token to Auth header
            setAuthToken(token);
            // Decode the token to get user data
            const decoded = jwt_decode(token);
            // Set the current user
            dispatch(setCurrentUser(decoded));
        })
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
        );
};

// Set logged in user
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};

// User is loading
export const setUserLoading = () => {
    return {
        type: USER_LOADING
    };
};

// Log the user out
export const logoutUser = () => dispatch => {
    // Remove the token from localstorage
    localStorage.removeItem("jwtToken");
    // Remove the auth header from future requests
    setAuthToken(false);
    // Set the current user to empty object {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
};