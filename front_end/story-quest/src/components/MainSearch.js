import React, {Component} from 'react';
import {Button, Container, Row, Col, Form, Input} from 'reactstrap';

class MainSearch extends Component {

    render() {
        return(
            <Container className="pt-md-5 pb-md-5" style={{backgroundColor: "#f1f1f1"}}>
                <h1 className="display-3 text-center">Find an artifact</h1>
                    <Row noGutters className="position-relative w-100 align-items-center">
                        <Col className="d-none d-flex justify-content-center">
                            <Form className="form" inline>
                                <Input type="search" className="mr-3" placeholder="Enter keyword or Artifact ID" />
                                <Button type="submit" color="secondary" outline>Search</Button>
                            </Form>
                        </Col>
                    </Row>
            </Container>
        )
    };

}

export default MainSearch;