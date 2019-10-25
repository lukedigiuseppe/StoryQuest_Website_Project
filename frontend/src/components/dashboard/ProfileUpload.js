// A very simple component that renders an Uppy uploader box for uploading a Profile Image.

import React, {Component} from 'react';
import ProfileImgUpload from '../media/ProfileImgUpload';

const PROFILE_UPLOAD = 'http://localhost:5000/api/users/upload_profile_image';

class ProfileUpload extends Component {
    
    render() {
        return (
            <ProfileImgUpload uploadPath={PROFILE_UPLOAD} />
        );
    }
}

export default ProfileUpload;
