import React, {Component} from 'react';
import {Button, Container, Row, Col, Form, Input} from 'reactstrap';


const searchBG = '/backgrounds/search_bg.jpg';

class MainSearch extends Component {

    render() {
        return(
            <Container className="pt-md-5 pb-md-5 rounded-lg" style={{backgroundImage: `url(${searchBG})`}} fluid>
                <br />
                <Row className="justify-content-center">
                    <h1 className="display-3 ">Find an artifact</h1>
                </Row>
                <br />
                <Row>
                    {/* Create two columns, one to hold the search bar and the other for the button */}
                    <Col sm={{size: 7, offset: 2}}>
                        <Form>
                            <Input type="search" className="mr-2" placeholder="Enter keyword or Artifact ID"/>
                        </Form>
                    </Col>
                    <Col>
                        <Form>
                            <Button type="submit" className="btn btn-primary">Search</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    };

}

export default MainSearch;