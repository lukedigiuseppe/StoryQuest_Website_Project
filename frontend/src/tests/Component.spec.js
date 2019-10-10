import React from 'react';
import ReactDOM from 'react-dom';
import ErrorAlert from '../components/alerts/ErrorAlert';
import MobileMenu from '../components/layout/MobileMenu';
import TopMenu from '../components/layout/TopMenu';
import Welcome from '../components/layout/Welcome';
import MainSearch from '../components/layout/MainSearch';

// This file contains rendering of different layout components that are isolated. To check that they do not throw errors

it('renders ErrorAlert without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ErrorAlert />, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('renders MobileMenu without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<MobileMenu />, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('renders TopMenu without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<TopMenu />, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('renders Welcome without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Welcome />, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('renders MainSearch without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<MainSearch />, div);
    ReactDOM.unmountComponentAtNode(div);
});