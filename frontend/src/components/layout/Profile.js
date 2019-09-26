import React, {Component} from 'react';
import {Container, Row, Col, Jumbotron, Button, Form, Input} from 'reactstrap';
import ProfileNavBar from './profileNavBar'
import MobileMenu2 from './MobileMenu2';
import '../../css/profile.css';
import {Helmet} from "react-helmet";
// This component displays a simple loading message for when the app is loading.


class Profile extends Component {

    render() {
        return(
            <div className="profile">
                {/* Change the header for the home menu */}
                <Helmet>
                    <title>My Profile</title>
                </Helmet>
                {/* Different navmenu bar to appear depending on whether it is viewed from a small or large screen */}
                    <Container className="d-none d-lg-flex"><ProfileNavBar /></Container>
                    <Container className="d-lg-none"><MobileMenu2 /></Container>
                <br /><br /><br />
                <br /><br /><br />
                <Container className="profileBox">
                            <img className ="profilePic" src='/images/thomas.jpeg' alt='user profile pic'/>
                            <div className="d-flex justify-content-center">
                                <p className="name">Thomas Tank</p>
                            </div>


                <div className="d-flex justify-content-center"><img className ="icon" src='/images/locationpin.png' alt='location icon'/>Heidelberg, DE</div>
                    <div className="d-flex justify-content-center"><img className ="icon" src='/images/tick.png' alt='location icon'/>Feb 2019</div>
                    <Row></Row>
                    <Row></Row>
                    <Row></Row>

                    <Row>
                        <Col><p className="artifactInfo"> Owned Artifacts: 5 </p></Col>
                        <Col> <p className="artifactInfo"> Collection Member: 10 </p></Col>

                    </Row>


                </Container>
                <br></br><br></br>
                <Container className="profileBox">
                    <p> CREDITS (WILL MOD LATER):<br></br><a href="https://icons8.com/icon/19326/map-pin">Map Pin icon by Icons8</a><br></br>
                        <a href="https://icons8.com/icon/102561/verified-account">Verified Account icon by Icons8</a>
                    </p>
                    <br></br>

                   </Container>


            </div>

        )
    }
}



export default Profile;