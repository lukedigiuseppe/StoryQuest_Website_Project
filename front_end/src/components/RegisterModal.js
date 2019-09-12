import React, {Component} from 'react';
import {
    Col,
    Button, 
    Form, 
    FormGroup, 
    Label, 
    Input, 
    Modal, 
    ModalHeader, 
    ModalBody, 
    ModalFooter,
} from 'reactstrap';

const INPUTWIDTH = 10;
const DESCWIDTH = 2;

class RegisterModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };

        this.toggle = this.toggle.bind(this);
    }

    // Toggle function to change the opening of the modal to the opposite based on the previous value
    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    render() {
        return (
            <div>
                {/* Create a button with the name passed in as props */}
                <Button color="secondary" onClick={this.toggle}>{this.props.buttonLabel}</Button>
                <Modal size="lg" isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Register an account</ModalHeader>
                    <ModalBody>
                        <Form>
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
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        {/* Add the submit and cancel button here */}
                        <Button color="primary" onClick={this.toggle}>Submit</Button>
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default RegisterModal;