import React, {Component} from 'react';
import { Container, Row, Col } from 'reactstrap';
import {Helmet} from 'react-helmet';

import TopMenu from './components/layout/TopMenu'
import MainSearch from './components/layout/MainSearch';
import MobileMenu from './components/layout/MobileMenu';
import Welcome from './components/layout/Welcome';

class App extends Component {
    render() {
        return(
            <div>
                {/* Change the header for the home menu */}
                <Helmet>
                    <title>Home - Story Quest</title>
                </Helmet>

                {/* Different navmenu bar to appear depending on whether it is viewed from a small or large screen */}
                <Container className="d-none d-lg-flex"><TopMenu /></Container>
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

export default App;
