import React, {Component} from 'react';
import {
    Button,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    Nav,
    NavItem,
    NavLink,
    DropdownMenu,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownItem,
    Collapse
} from 'reactstrap';

const LOGO = '/images/storyQuest.png'

class MobileMenu extends Component {

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
                <Navbar fixed="top" color="secondary" light className="border-bottom border-gray">
                    <NavbarBrand href="/" className="d-inline-block p-1" style={{width: 70}}>
                        <img src={LOGO} alt="Logo" className="position-relative img-fluid rounded-sm" />
                    </NavbarBrand>
                    <NavbarToggler onClick={this.toggle} className="mr-2" />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav navbar>
                            <NavItem>
                                <NavLink className="font-weight-bold" href="/">About</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className="font-weight-bold" href="/">Getting Started</NavLink>
                            </NavItem>
                            <NavItem>
                                <UncontrolledDropdown className="d-flex align-items-center" nav inNavbar>
                                    <DropdownToggle className="font-weight-bold" nav caret><i className="fa fa-user-circle" style={{fontSize: "36px"}} /></DropdownToggle>
                                    <DropdownMenu right>
                                    <DropdownItem href="/login"><Button>Login</Button></DropdownItem>
                                    <DropdownItem href="/register"><Button>Register</Button></DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </header>
        )
    };
}

export default MobileMenu;