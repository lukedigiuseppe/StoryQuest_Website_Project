// This file contains the actions to do whenever a new file is added for upload by the user

import {
    VIDS_UPLOADED,
    VIDS_UPLOADING,
    IMGS_UPLOADED,
    IMGS_UPLOADING,
    HAS_VIDS,
    HAS_NO_VIDS,
    HAS_IMGS,
    HAS_NO_IMGS
} from "./types"

// Videos have been uploaded
export const setVidUploaded = () => {
    return {
        type: VIDS_UPLOADED
    };
};

// Videos are uploading
export const setVidUploading = () => {
    return {
        type: VIDS_UPLOADING
    };
}

// Has videos to upload
export const setHasVids = () => {
    return {
        type: HAS_VIDS
    };
}

// Has no more videos to upload
export const setHasNoVids = () => {
    return {
        type: HAS_NO_VIDS
    };
}

// Images have been uploaded
export const setImgUploaded = () => {
    return {
        type: IMGS_UPLOADED
    };
}

// Images are uploading
export const setImgUploading = () => {
    return {
        type: IMGS_UPLOADING
    };
}

// Has images to upload
export const setHasImgs = () => {
    return {
        type: HAS_IMGS
    };
}

// Has no images to upload
export const setHasNoImgs = () => {
    return {
        type: HAS_NO_IMGS
    };
}