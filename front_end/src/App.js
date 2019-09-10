import React, {Component} from 'react';
import { Container, Row, Col } from 'reactstrap';

import TopMenu from './components/TopMenu'
import MainSearch from './components/MainSearch';
import MobileMenu from './components/MobileMenu';

class App extends Component {
    render() {
        return(
            <div>
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
            </div>
        )
    }
}

export default App;
