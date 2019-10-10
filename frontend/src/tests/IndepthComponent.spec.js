// This file tests the rendering of a component in depth by looking at what is contained in it. As well as state changes and the 
// component lifecycle.

import React from 'react';
import { mount } from 'enzyme';
import App from '../App';
import { Provider } from "react-redux";
import store from "../store";


it('renders Find an artifact heading in homepage', () => {
    const wrapper = mount(<Provider store={store}><App /></Provider>);
    const findArtifact = <h1 className="display-3 ">Find an artifact</h1>
    expect(wrapper).toContainReact(findArtifact);
});