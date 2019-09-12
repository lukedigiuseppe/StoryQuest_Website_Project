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
import RegisterModal from './RegisterModal';

const AVATAR = '/images/profile_icon.png';
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
                <Navbar fixed="top" color="light" light className="border-bottom border-gray">
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
                                    <DropdownToggle className="font-weight-bold" nav caret><img src={AVATAR} alt="avatar" className="img-fluid rounded-circle" style={{width: 36 }} /> Account</DropdownToggle>
                                    <DropdownMenu right>
                                    <DropdownItem href="/login"><Button>Login</Button></DropdownItem>
                                    <DropdownItem><RegisterModal buttonLabel="Register" /></DropdownItem>
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