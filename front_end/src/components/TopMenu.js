import React, {Component} from 'react';
import {
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
  Collapse
} from 'reactstrap';

const AVATAR = './images/profile_icon.png';
const LOGO = './images/storyQuest.png'

class TopMenu extends Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    // Toggle function to switch state depending on whether to expand nav menu or not
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return(
            <header>
                <Navbar fixed="top" color="light" light expand="xs" className="border-bottom border-gray" style={{height: 80}}>
                    {/* Use grid system to create 1 row and 3 columns to put each of the Navbar elements into */}
                    <Container>
                        <Row noGutters className="position-relative w-100 align-items-center">
                        
                            <Col className="d-none d-lg-flex justify-content-start">
                                <NavItem className="d-flex align-items-center">
                                    <NavLink className="font-weight-bold " href="/">About</NavLink>
                                </NavItem>
                                
                                <NavItem className="d-flex align-items-center">
                                    <NavLink className="font-weight-bold " href="/">Getting Started</NavLink>
                                </NavItem>

                            </Col>
                            
                            <Col className="d-flex justify-content-xs-center justify-content-lg-center">
                                <NavbarBrand className="d-inline-block p-0" href="/" style={{ width: 80 }}>
                                    <img src={LOGO} alt="logo" className="position-relative img-fluid" />
                                </NavbarBrand>
                            </Col>

                            <Col className="d-none d-lg-flex justify-content-end">
                                <Nav className="mrx-auto" navbar>
                                    <UncontrolledDropdown className="d-flex align-items-center" nav inNavbar>
                                        <DropdownToggle className="font-weight-bold" nav caret><img src={AVATAR} alt="avatar" className="img-fluid rounded-circle" style={{width: 36 }} /></DropdownToggle>
                                        <DropdownMenu right>
                                        <DropdownItem>Login</DropdownItem>
                                        <DropdownItem>Register</DropdownItem>
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