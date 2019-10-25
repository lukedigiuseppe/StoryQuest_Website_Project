/* This is a reducer file. Reducers are a pure function that specifies how application state should change in response
 * to an action. They respond with the new state by passing it to the store which is then read in by the React-UI
 */

//  This reducer file is responsible for updating the state based on the results of the image and video upload

//  Import all actions
import {
    VIDS_UPLOADED,
    VIDS_UPLOADING,
    IMGS_UPLOADED,
    IMGS_UPLOADING,
    HAS_VIDS,
    HAS_NO_VIDS,
    HAS_IMGS,
    HAS_NO_IMGS
} from "../actions/types";

const initialState = {
    vidUploaded: false,
    imgUploaded: false,
    hasVids: false,
    hasImgs: false
};

export default function(state = initialState, action) {
    switch (action.type) {
        case VIDS_UPLOADED:
            return {
                ...state,
                vidUploaded: true
            };
        case VIDS_UPLOADING:
            return {
                ...state,
                vidUploaded: false
            }
        case HAS_VIDS:
            return {
                ...state,
                hasVids: true
            }
        case HAS_NO_VIDS:
            return {
                ...state,
                hasVids: false
            }
        case IMGS_UPLOADED:
            return {
                ...state,
                imgUploaded: true
            }
        case IMGS_UPLOADING:
            return {
                ...state,
                imgUploaded: false
            }
        case HAS_IMGS:
            return {
                ...state,
                hasImgs: true
            }
        case HAS_NO_IMGS:
            return {
                ...state,
                hasImgs: false
            }
        default:
            return state;
    }
}