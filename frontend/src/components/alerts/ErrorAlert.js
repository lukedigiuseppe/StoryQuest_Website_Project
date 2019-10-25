import React, {Component} from 'react';
import {Collapse, Alert} from 'reactstrap';
import PropTypes from 'prop-types';
import isEmpty from 'is-empty';

// This component defines an error alert message. Pass in the error message to be displayed as props. If error message
// is empty or undefined it won't display anything

class ErrorAlert extends Component {

    render() {
        // Shorthand for saying if error msg is empty then don't display the error alert
        var doCollapse = !isEmpty(this.props.errorMsg) ? true : false

        return(
            <Collapse isOpen={doCollapse}><Alert color="danger">{this.props.errorMsg}</Alert></Collapse>
        );
    }
}

ErrorAlert.propTypes = {
    errorMsg: PropTypes.string
};

export default ErrorAlert;