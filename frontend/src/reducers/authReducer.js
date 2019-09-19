/* This is a reducer file. Reducers are a pure function that specifies how application state should change in response
 * to an action. They respond with the new state by passing it to the store which is then read in by the React-UI
 */

//  Import all actions
import {
    SET_CURRENT_USER,
    USER_LOADING,
    USER_NOT_LOADING
} from "../actions/types";

const isEmpty = require("is-empty");

const initialState = {
    isAuthenticated: false,
    user: {},
    loading: false
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            };
        case USER_LOADING:
            return {
                ...state,
                loading: true
            };
        case USER_NOT_LOADING:
            return {
                ...state,
                loading: false
            }
        default:
            return state;
    }
}