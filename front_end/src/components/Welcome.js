import React, {Component} from 'react';
import {Container, Row, Col, Jumbotron, Button} from 'reactstrap';

class Welcome extends Component {

    render() {
        return(
            <div>
                <br />
                <Container className="pt-md-5 pb-md-5 rounded-lg" style={{backgroundColor: 'rgba(255,255,220,0.8)'}} fluid>
                    <Row className="pt-3">
                        <Col><h1 className="text-center">Welcome to Story Quest!</h1><hr style={{borderTop: '5px solid black'}}/></Col>
                    </Row>
                    <Row noGutters className="position-relative w-100 align-items-center">
                        <Col className="d-flex justify-content-xs-center justify-content-lg-center">
                            <figure className="figure">
                                <img className="px-2 figure-img img-fluid rounded" src='/images/vase.jpg' alt='Antique vase' style={{width: 360, height: 360}} />
                                <figcaption className="figure-caption text-center">Add anything that you think of as an artifact.</figcaption>
                            </figure>
                            <figure className="figure">
                                <img className="px-2 figure-img img-fluid rounded" src='/images/jewelryBox.jpg' alt='Unique Jewelry Box' style={{width: 360, height: 360}} />
                                <figcaption className="figure-caption text-center">Register and keep them here for future generations.</figcaption>
                            </figure>
                            <figure className="figure">
                                <img className="px-2 figure-img img-fluid rounded" src='/images/watchAntique.jpg' alt='Antique Watch' style={{width: 360, height: 360}} />
                                <figcaption className="figure-caption text-center">Everything has a story, it's up to you to tell it.</figcaption>
                            </figure>
                            <figure className="figure">
                                <img className="px-2 figure-img img-fluid rounded" src='/images/ringHeirloom.jpg' alt='Ring heirloom' style={{width: 360, height: 360}} />
                                <figcaption className="figure-caption text-center">Keep precious memories stored here so you can never forget.</figcaption>
                            </figure>
                        </Col>
                    </Row>
                </Container>
                <br />
                <Jumbotron style={{backgroundColor: 'rgba(255,255,220,0.8)'}}>
                    <h1 className="display-3">What is Story Quest?</h1>
                    <p className="lead">Slogan/Brief description goes here.</p>
                    <hr className="my-2" />
                    <p>Long, detailed description goes here.</p>
                    <p className="lead">
                    <Button href="https://www.google.com.au" color="primary">Learn How</Button>
                    </p>
                </Jumbotron>
            </div>
        )
    }
}

export default Welcome;