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

import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../../actions/authActions";
import axios from "axios";

const LOGO = '/images/cover.png';

class ProfileNavBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            image: ""
        }
    }

    componentDidMount () {
        axios.get('/api/users/profile/' + this.props.auth.user.email)
            .then(res => {
                this.setState({
                    image: res.data
                });
            })
            .catch(err => {
                console.log(err);
            })
    }


    onLogoutClick = (e) => {
        e.preventDefault();
        this.props.logoutUser();
        this.props.history.push('/login');
    };

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
                                        <NavLink className="font-weight-bold " href="/myartifacts">My Artifacts</NavLink>
                                    </NavItem>
                                    <NavItem className="d-flex align-items-center">
                                        <NavLink className="font-weight-bold " href="/add_artifact">Add An Artifact</NavLink>
                                    </NavItem>
                                </Nav>
                            </Col>

                            <Col className="d-flex justify-content-xs-center justify-content-lg-center">
                                <NavbarBrand className="d-inline-block p-1" href="/" style={{ width: 180}}>
                                    <img src={LOGO} alt="logo" className="position-relative img-fluid rounded-sm" />
                                </NavbarBrand>
                            </Col>

                            <Col className="d-none d-lg-flex justify-content-end">
                                <Nav className="mrx-auto" navbar>
                                    <UncontrolledDropdown className="d-flex align-items-center" nav inNavbar>
                                        <DropdownToggle style={{display: "flex", alignItems: "center"}} className="font-weight-bold" nav caret><img style={{height: "40px",width: "40px"}} src={`data:image/jpeg;base64, ${this.state.image}`}/>{this.props.auth.user.name}</DropdownToggle>
                                        <DropdownMenu right>
                                            <DropdownItem href="/myprofile"><Button>My Profile</Button></DropdownItem>
                                            <DropdownItem href="/login"><Button onClick={this.onLogoutClick}>Logout</Button></DropdownItem> 
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

ProfileNavBar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};

const MapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    MapStateToProps, 
    {logoutUser}
)(ProfileNavBar);