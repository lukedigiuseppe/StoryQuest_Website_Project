import React, {Component} from 'react';
import Helmet from 'react-helmet';
// import {withRouter}  from 'react-router-dom';
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

import '../../css/register.css';

// Compononent that creates the regsitration page for new users.
// Need to add code that redirects to another page after pressing submit

const INPUTWIDTH = 10;
const DESCWIDTH = 2;
const BANNER = "/images/cover.png"

class Register extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            email: "",
            password: "",
            confirmPass: "",
            errors: {}
        }
    }

    // Prevent user from navigating to this page if already logged in
    // componentDidMount() {
    //     // If logged in and user navigates to Register page, should redirect them to homepage
    //     if (this.props.auth.isAuthenticated) {
    //         this.props.history.push("/");
    //     }
    // }

    // This allows us to display errors on the form
    // componentDidUpdate(prevProps) {
    //     if (this.props.errors !== prevProps.errors) {
    //         this.setState({
    //             errors: this.props.errors
    //         });
    //     }
    // }

    onChange = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = (e) => {
        e.preventDefault();
        
        const newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.confirmPass
        };

        // Register the user by using the passed in registerUser action from redux
        // this.props.registerUser(newUser, this.props.history);
        console.log(newUser);
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

                <Container className="justify-content-center" fluid>
                    <Row>
                        <img src={BANNER} alt="StoryQuest Banner" className="banner-image"/>
                    </Row>
                </Container>
                {/* The form container */}
                <Container className="text-center register-box bg-light rounded-lg">
                    <h1 className="text-left" style={{paddingLeft: "30px"}}>Create an account</h1>
                    <Form noValidate className="register-form" onSubmit={this.onSubmit}>
                        <FormGroup row>
                            <Label for="username" sm={DESCWIDTH}>Username</Label>
                            <Col sm={INPUTWIDTH}>
                                <Input 
                                    type="text" 
                                    id="username" 
                                    placeholder="Enter your username" 
                                />
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
                                />
                            </Col>
                        </FormGroup>
                        {/* <FormGroup row>
                            <Label for="confirmEmail" sm={DESCWIDTH}>Confirm Email</Label>
                            <Col sm={INPUTWIDTH}>
                                <Input 
                                    type="email" 
                                    id="confirmEmail" 
                                    placeholder="Confirm your email"  
                                />
                            </Col>
                        </FormGroup> */}
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
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor="confirmPass" sm={DESCWIDTH}>Confirm Password</Label>
                            <Col sm={INPUTWIDTH}>
                                <Input
                                    onChange={this.onChange}
                                    value={this.state.confirmPass}
                                    error={errors.password}
                                    type="password"
                                    id="confirmPass"
                                    placeholder="Confirm your password"
                                />
                            </Col>
                        </FormGroup>
                        {/* <FormGroup row>
                            <Label for="birthDate" sm={DESCWIDTH}>Date of Birth</Label>
                            <Col sm={INPUTWIDTH}>
                                <Input type="date" name="birthDate" id="birthDate" />
                            </Col>
                        </FormGroup> */}
                        <br />
                        <Button className="btn-lg btn-primary rounded-lg" type="submit" block>Create account</Button>
                    </Form>
                    <p className="mt-5 mb-3 text-muted">&copy; Team FrankTheTank 2019</p>
                </Container>
            </div>
        )
    }
}

export default Register;