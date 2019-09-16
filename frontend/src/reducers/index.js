// This is our root reducer that combines all of the reducers together

import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";

export default combineReducers({
    auth: authReducer,
    errors: errorReducer
});

