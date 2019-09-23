import {createStore, applyMiddleware, compose}  from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const initialState = {};

// Array of middleware that we are using
const middleware = [thunk];

const store = createStore(
    rootReducer,
    initialState,
    compose(
        applyMiddleware(...middleware),
        // The below part is necessary for the REDUX extensions in Chrome and Firefox to work. For dev purposes only.
        (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && 
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()) ||
        compose
    )
);

export default store;