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

class MobileMenu2 extends Component {

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
                <Navbar fixed="top" color="white" light className="border-bottom border-gray">
                    <NavbarBrand href="/" className="d-inline-block p-1" style={{width: 60}}>
                        <img src={LOGO} alt="Logo" className="position-relative img-fluid rounded-sm" />
                    </NavbarBrand>
                    <NavbarToggler onClick={this.toggle} className="mr-2" />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav navbar>
                            <NavItem>
                                <NavLink className="font-weight-bold" href="/">Home</NavLink>
                            </NavItem>
                            <NavItem>
                            <NavLink className="font-weight-bold" href="/Profile">My Profile</NavLink>
                        </NavItem>
                            <NavItem>
                                <NavLink className="font-weight-bold" href="/logout">Logout</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </header>
        )
    };
}

export default MobileMenu2;
