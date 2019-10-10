import React, {Component} from 'react';
import { Container, Row, Col } from 'reactstrap';
import {Helmet} from 'react-helmet';
import PropTypes from "prop-types";
import {connect} from 'react-redux';

import TopMenu from './components/layout/TopMenu'
import MainSearch from './components/layout/MainSearch';
import MobileMenu from './components/layout/MobileMenu';
import Welcome from './components/layout/Welcome';
import ProfileNavBar from './components/layout/profileNavBar';

class App extends Component {

    render() {

        const navMenu = this.props.auth.isAuthenticated ? <Container className="d-none d-lg-flex"><ProfileNavBar /></Container> : <Container className="d-none d-lg-flex"><TopMenu /></Container>;

        return(
            <div>
                {/* Change the header for the home menu */}
                <Helmet>
                    <title>Home - Story Quest</title>
                </Helmet>

                {/* Different navmenu bar to appear depending on whether it is viewed from a small or large screen */}
                {/* <Container className="d-none d-lg-flex"><TopMenu /></Container> */}
                {navMenu}
                <Container className="d-lg-none"><MobileMenu /></Container>
                <br /><br /><br />
                <Container fluid>
                    <Row>
                        <Col sm={{size: 8, offset: 2}} style={{padding: '5px'}}>
                            <MainSearch />
                        </Col>
                    </Row>
                </Container>
                <Welcome />
            </div>
        )
    }
}

App.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(App);
