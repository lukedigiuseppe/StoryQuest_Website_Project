// The component that renders the register form and all corresponding logic to read user input and send it to the backend server

import React, {Component} from 'react';
import Helmet from 'react-helmet';
import {Link, withRouter}  from 'react-router-dom';
import PropTypes from "prop-types";
import {connect} from 'react-redux';
import {registerUser} from '../../actions/authActions';
import classnames from 'classnames';
import {
    Container,
    Col,
    Row,
    Button, 
    Form, 
    FormGroup, 
    Label, 
    Input
} from 'reactstrap';

import ErrorAlert from '../alerts/ErrorAlert';

import '../../css/register.css';

const INPUTWIDTH = 10;
const DESCWIDTH = 2;

class Register extends Component {

    constructor(props) {
        super(props);

        this.state = {
            publicName: "",
            firstName: "",
            lastName: "",
            email: "",
            confirmEmail: "",
            password: "",
            confirmPass: "",
            birthDate: "",
            errors: {},
        }
    }

    // Prevent user from navigating to this page if already logged in
    componentDidMount() {
        // If logged in and user navigates to Register page, should redirect them to homepage
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/");
        }
    }

    // This allows us to display errors on the form
    componentDidUpdate(prevProps) {
        if (this.props.errors !== prevProps.errors) {
            this.setState({
                errors: this.props.errors
            });
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = (e) => {
        e.preventDefault();
        
        // Send the entire state including confirmation fields so that it can be validated on at the backend
        const newUser = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            publicName: this.state.publicName,
            email: this.state.email,
            confirmEmail: this.state.confirmEmail,
            password: this.state.password,
            confirmPass: this.state.confirmPass,
            birthDate: this.state.birthDate
        };
        
        // Register the user through the registerUser action in order to update global application state through redux
        this.props.registerUser(newUser, this.props.history);
    };

    render() {

        const { errors } = this.state;

        return (
            <div>
                {/* Change the title of the page */}
                <Helmet> 
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                    <title>Register an account</title>
                </Helmet>

                {/* The form container */}
                <Container style={{transform: "translate(0%, 5%)"}} className="register-box bg-light rounded-lg">
                    <Row>
                        <Link to="/" style={{paddingLeft: "40px", paddingTop: "10px", paddingBottom: "20px"}}>
                        <i className="far fa-arrow-alt-circle-left" style={{fontSize: "20px"}}> Back to Home</i>
                        </Link>
                    </Row>
                    <h1 className="text-left" style={{paddingLeft: "30px"}}>Create an account</h1>
                    <Form noValidate className="register-form" onSubmit={this.onSubmit}>
                        <FormGroup row>
                            <Label htmlFor="publicName" sm={DESCWIDTH}>Public name</Label>
                            <Col sm={INPUTWIDTH}>
                                <Input
                                    onChange={this.onChange}
                                    value={this.state.publicName}
                                    error={errors.publicName} 
                                    type="text" 
                                    id="publicName" 
                                    placeholder="Enter a public name (this name will be visible to all users)" 
                                />
                                <ErrorAlert errorMsg={errors.publicName} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor="firstName" sm={DESCWIDTH}>Given name</Label>
                            <Col sm={INPUTWIDTH}>
                                <Input
                                    onChange={this.onChange}
                                    value={this.state.firstName}
                                    error={errors.firstName} 
                                    type="text" 
                                    id="firstName" 
                                    placeholder="Enter your given name" 
                                />
                                <ErrorAlert errorMsg={errors.firstName} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor="lastName" sm={DESCWIDTH}>Family name</Label>
                            <Col sm={INPUTWIDTH}>
                                <Input
                                    onChange={this.onChange}
                                    value={this.state.lastName}
                                    error={errors.lastName} 
                                    type="text" 
                                    id="lastName" 
                                    placeholder="Enter your family name" 
                                />
                                <ErrorAlert errorMsg={errors.lastName} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor="emailAddress" sm={DESCWIDTH}>Email</Label>
                            <Col sm={INPUTWIDTH}>
                                <Input
                                    onChange={this.onChange}
                                    value={this.state.email}
                                    error={errors.email}
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className={classnames("", {
                                        invalid: errors.email
                                    })}
                                />
                                <ErrorAlert errorMsg={errors.email} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="confirmEmail" sm={DESCWIDTH}>Confirm Email</Label>
                            <Col sm={INPUTWIDTH}>
                                <Input
                                    onChange={this.onChange}
                                    value={this.state.confirmEmail}
                                    error={errors.confirmEmail}
                                    type="email" 
                                    id="confirmEmail" 
                                    placeholder="Confirm your email"  
                                />
                                <ErrorAlert errorMsg={errors.confirmEmail} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor="password" sm={DESCWIDTH}>Password</Label>
                            <Col sm={INPUTWIDTH}>
                                <Input 
                                    onChange={this.onChange}
                                    value={this.state.password}
                                    error={errors.password}
                                    type="password" 
                                    id="password" 
                                    placeholder="Enter a password" 
                                    className={classnames("", {
                                        invalid: errors.password
                                    })}
                                />
                                <ErrorAlert errorMsg={errors.password} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor="confirmPass" sm={DESCWIDTH}>Confirm Password</Label>
                            <Col sm={INPUTWIDTH}>
                                <Input
                                    onChange={this.onChange}
                                    value={this.state.confirmPass}
                                    error={errors.confirmPass}
                                    type="password"
                                    id="confirmPass"
                                    placeholder="Confirm your password"
                                    className={classnames("", {
                                        invalid: errors.confirmPass
                                    })}
                                />
                                <ErrorAlert errorMsg={errors.confirmPass} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="birthDate" sm={DESCWIDTH}>Date of Birth</Label>
                            <Col sm={INPUTWIDTH}>
                                <Input 
                                    onChange={this.onChange}
                                    value={this.state.birthDate}
                                    error={errors.birthDate}
                                    type="date" 
                                    name="birthDate" 
                                    id="birthDate" 
                                />
                                <ErrorAlert errorMsg={errors.birthDate} />
                            </Col>
                        </FormGroup>
                        <br />
                        <Button className="btn-lg btn-primary rounded-lg" type="submit" block>Create account</Button>
                    </Form>
                    <p className="text-center mt-3 text-muted">Already have an account? <Link style={{color: "blue"}} to="/login">Login</Link></p>
                    <p className="text-center mt-3 mb-3 text-muted">&copy; Team FrankTheTank 2019</p>
                </Container>
            </div>
        )
    }
}

// We define prop types here as good convention. And also because we aren't able to define types within the constructor so they
// go here
Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

// The below declaration enables us to get our states from Redux and then map it to props which will
// be used by the component
const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

// This statement connects our component to the redux action we specify
// withRouter is used here to enable routing within actions 
export default connect(
    mapStateToProps,
    {registerUser}
)(withRouter(Register));
