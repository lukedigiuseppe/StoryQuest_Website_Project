import React, {Component} from 'react';
import Helmet from 'react-helmet';
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

    render() {
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
                <Container className="text-center register-box bg-light rounded-lg">
                    <h1 className="text-left" style={{paddingLeft: "30px"}}>Create an account</h1>
                    <Form className="register-form">
                        <FormGroup row>
                            <Label for="emailAddress" sm={DESCWIDTH}>Email</Label>
                            <Col sm={INPUTWIDTH}>
                                <Input type="email" name="email" id="emailAddress" placeholder="Enter your email" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="confirmEmail" sm={DESCWIDTH}>Confirm Email</Label>
                            <Col sm={INPUTWIDTH}>
                                <Input type="email" name="email" id="confirmEmail" placeholder="Confirm your email"  />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="username" sm={DESCWIDTH}>Username</Label>
                            <Col sm={INPUTWIDTH}>
                                <Input type="text" name="username" id="username" placeholder="Enter your username" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="password" sm={DESCWIDTH}>Password</Label>
                            <Col sm={INPUTWIDTH}>
                                <Input type="password" name="password" id="password" placeholder="Enter a password" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="confirmPass" sm={DESCWIDTH}>Confirm Password</Label>
                            <Col sm={INPUTWIDTH}>
                                <Input type="password" name="password" id="confirmPass" placeholder="Confirm your password" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="birthDate" sm={DESCWIDTH}>Date of Birth</Label>
                            <Col sm={INPUTWIDTH}>
                                <Input type="date" name="birthDate" id="birthDate" />
                            </Col>
                        </FormGroup>
                        <br />
                        <Button className="btn-lg btn-primary rounded-lg" block>Create account</Button>
                    </Form>
                    <p className="mt-5 mb-3 text-muted">&copy; Team FrankTheTank 2019</p>
                </Container>
            </div>
        )
    }
}

export default Register;