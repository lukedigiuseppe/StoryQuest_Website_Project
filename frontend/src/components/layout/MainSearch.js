import React, {Component} from 'react';
import {Button, Container, Row, Col, Form, Input} from 'reactstrap';

const searchBG = '/backgrounds/search_bg.jpg';

class MainSearch extends Component {
    // only need to hold the artifact list and the search text to search
    constructor(props) {
        super(props);

        this.state = {
            search: ""
        }
    }

    onChange = (e) => {
        this.setState({[e.target.id]: e.target.value});
    }

    onSubmit = (e) => {
        e.preventDefault()
        window.location.href = '/list/' + this.state.search;
    }

    // render everything
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
                        <Form onSubmit={this.onSubmit}>
                            <Input type="search"
                                   id="search"
                                   className="mr-2"
                                   onChange={this.onChange}
                                   value={this.state.search}
                                   placeholder="Enter a keyword"/>
                        </Form>
                    </Col>
                    <Col>
                        <Form>
                            <Button onClick={this.onSubmit}>Search</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    };

}

export default MainSearch;