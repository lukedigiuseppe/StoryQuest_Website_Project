import React, {Component} from 'react';
import {Button, Label, Input, Form} from 'reactstrap';
import {Helmet} from 'react-helmet';
import {Link} from 'react-router-dom';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";

import ErrorAlert from "../alerts/ErrorAlert";

import '../../css/login.css'

const LOGO = '/images/storyQuest.png';

class Login extends Component {

    constructor(props) {
        super(props);

        this.state={
            email: "",
            password: "",
            errors: {}
        };
    }

    // Prevent user from navigating to this page if already logged in
    componentDidMount() {
        // If logged in and user navigates to Login page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/dashboard");
        }
    }

    // Push user to dashboard when they login
    componentDidUpdate(prevProps) {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/dashboard");
        }

        if (this.props.errors !== prevProps.errors) {
            this.setState({
                errors: this.props.errors
            });
        }
    }

    onChange = (e) => {
        this.setState({[e.target.id]: e.target.value});
    }

    onSubmit = (e) => {
        e.preventDefault();

        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        
        // Redirect is handled by the component (or redux action) so we don't need to use this.props.history
        this.props.loginUser(userData);
    };

    render() {

        const { errors } = this.state;

        return (
            <div>
                <Helmet> 
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                    <title>Login to Story Quest</title>
                </Helmet>
                {/* The main signin form */}
                <div className="text-center signin-box bg-light">
                    <Form noValidate className="form-signin" onSubmit={this.onSubmit}>
                        <Link to="/"><img className="mb-4" src={LOGO} alt="" width="72" height="72" /></Link>
                        <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
                        <Label htmlFor="email" className="sr-only">Email address</Label>
                        <Input 
                            onChange={this.onChange}
                            value={this.state.email}
                            error={errors.email}
                            type="email" 
                            id="email" 
                            className={classnames("form-control", {
                                        invalid: errors.email || errors.emailnotfound
                                    })}
                            placeholder="Email address" 
                            required autoFocus 
                        />
                        <ErrorAlert errorMsg={errors.email} />
                        <ErrorAlert errorMsg={errors.emailnotfound} />
                        <Label htmlFor="password" className="sr-only">Password</Label>
                        <Input 
                            onChange={this.onChange}
                            value={this.state.password}
                            error={errors.password}
                            type="password" 
                            id="password" 
                            className={classnames("form-control", {
                                        invalid: errors.password || errors.passwordincorrect
                                    })}
                            placeholder="Password" 
                            required 
                        />
                        <ErrorAlert errorMsg={errors.password} />
                        <ErrorAlert errorMsg={errors.passwordincorrect} />
                        <div className="checkbox mb-3">
                            <Label>
                                {/* Remember me functionality currently does not work */}
                                <Input type="checkbox" value="rememberMe" />
                                Remember me
                            </Label>
                        </div>
                        <Button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</Button>
                        <p className="mt-3 mb-2">Don't have an account? <Link style={{color: "blue"}} to="/register">Register here</Link></p>
                        <p className="mt-5 mb-3 text-muted">&copy; Team FrankTheTank 2019</p>
                    </Form>
                </div>
            </div>
        )
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

// This maps the state that we get from the Redux store to the props for this component
const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { loginUser }
)(Login);