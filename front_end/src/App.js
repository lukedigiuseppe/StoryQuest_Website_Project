import React, {Component, Fragment} from 'react';
import { Container, Row, Col } from 'reactstrap';

import TopMenu from './components/TopMenu'
import MainSearch from './components/MainSearch';

class App extends Component {
    render() {
        return(
            <Fragment>
                <TopMenu />
                <main className="my-3 py-3">
                    <Container className="px-0">
                        <Row noGutters className="pt-2 pt-md-5 w-100 px-4 px-xl-0 position-relative">
                            <Col className="pt-1">
                            <MainSearch />
                            </Col>
                        </Row>
                    </Container>
                </main>
            </Fragment>
        )
    }
}

export default App;
