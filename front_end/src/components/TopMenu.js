import React, {Component} from 'react';
import {
    Button,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    Nav,
    NavItem,
    NavLink,
    Container,
    Row,
    Col,
    DropdownMenu,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownItem,
} from 'reactstrap';

import RegisterModal from './RegisterModal';

const LOGO = '/images/storyQuest.png'

class TopMenu extends Component {

    render() {
        return(
            <header>
                <Navbar fixed="top" color="secondary" light expand="xs" className="border-bottom border-gray" style={{height: 80}}>
                    {/* Use grid system to create 1 row and 3 columns to put each of the Navbar elements into */}
                    <NavbarToggler onClick={this.toggle}/>
                    <Container>
                        <Row noGutters className="position-relative w-100 align-items-center">
                            <Col className="d-none d-lg-flex justify-content-start">
                                <Nav className="mlx-auto" navbar>
                                    <NavItem className="d-flex align-items-center">
                                        <NavLink className="font-weight-bold " href="/">About</NavLink>
                                    </NavItem>
                                    <NavItem className="d-flex align-items-center">
                                        <NavLink className="font-weight-bold " href="/">Getting Started</NavLink>
                                    </NavItem>
                                </Nav>
                            </Col>
                            
                            <Col className="d-flex justify-content-xs-center justify-content-lg-center">
                                <NavbarBrand className="d-inline-block p-1" href="/" style={{ width: 80 }}>
                                    <img src={LOGO} alt="logo" className="position-relative img-fluid rounded-sm" />
                                </NavbarBrand>
                            </Col>

                            <Col className="d-none d-lg-flex justify-content-end">
                                <Nav className="mrx-auto" navbar>
                                    <UncontrolledDropdown className="d-flex align-items-center" nav inNavbar>
                                        <DropdownToggle className="font-weight-bold" nav caret><i className="fa fa-user-circle" style={{fontSize: "36px"}} /></DropdownToggle>
                                        <DropdownMenu right>
                                        <DropdownItem href="/login"><Button>Login</Button></DropdownItem>
                                        <DropdownItem><RegisterModal buttonLabel="Register" /></DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </Nav>
                            </Col>
                        </Row>
                    </Container>
                </Navbar>
            </header>
        )
    };
} 

export default TopMenu;