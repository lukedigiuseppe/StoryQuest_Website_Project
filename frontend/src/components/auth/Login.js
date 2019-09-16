import React, {Component} from 'react';
import {Button, Label, Input, Form} from 'reactstrap';
import {Helmet} from 'react-helmet';

import '../../css/login.css'

const LOGO = '/images/storyQuest.png';

class Login extends Component {

    render() {
        return (
            <div>
                <Helmet> 
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                    <title>Login to Story Quest</title>
                </Helmet>
                {/* The main signin form */}
                <div className="text-center signin-box bg-light">
                    <Form className="form-signin">
                        <img className="mb-4" src={LOGO} alt="" width="72" height="72" />
                        <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
                        <Label for="inputEmail" className="sr-only">Email address</Label>
                        <Input type="email" id="inputEmail" className="form-control" placeholder="Email address" required autoFocus />
                        <Label for="inputPassword" className="sr-only">Password</Label>
                        <Input type="password" id="inputPassword" className="form-control" placeholder="Password" required />
                        <div className="checkbox mb-3">
                            <Label>
                                {/* Remember me functionality currently does not work */}
                                <Input type="checkbox" value="rememberMe" />
                                Remember me
                            </Label>
                        </div>
                        <Button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</Button>
                        <p className="mt-5 mb-3 text-muted">&copy; Team FrankTheTank 2019</p>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Login;