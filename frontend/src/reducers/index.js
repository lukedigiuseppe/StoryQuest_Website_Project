// This is our root reducer that combines all of the reducers together

import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import fileReducer from "./fileReducer";

export default combineReducers({
    // This what the state object is whenever you call mapStateToProps. When you connect these
    // get linked to that component
    auth: authReducer,
    errors: errorReducer,
    files: fileReducer
});

