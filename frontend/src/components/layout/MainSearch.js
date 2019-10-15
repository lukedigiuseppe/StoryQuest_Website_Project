import React, {Component} from 'react';
import {Button, Container, Row, Col, Form, Input} from 'reactstrap';
import axios from "axios";
import {Link} from "react-router-dom";


const searchBG = '/backgrounds/search_bg.jpg';

const Artifact = props => (
    <tr>
        <td>
            <Link to={"/view_artifact/"+props.artifacts._id}>{props.artifacts.name}</Link>
        </td>
        <td>{props.artifacts.story.substring(0,25)} ...</td>
        <td>{props.artifacts.dateMade} </td>
    </tr>
)

class MainSearch extends Component {
    // only need to hold the artifact list and the search text to search
    constructor(props) {
        super(props);

        this.state = {
            search: "",
            artifacts: []
        }
    }

    onChange = (e) => {
        this.setState({[e.target.id]: e.target.value});
    }

    onSubmit = (e) => {
        e.preventDefault()
        console.log(this.state);

        axios.all([axios.post('/searchartifacts', {searchString: this.state.search})])
            .then(axios.spread((artiRes) => {
                console.log(artiRes)
                this.setState({
                    artifacts: artiRes.data
                });
            }))
            .catch(err => {
                console.log(err);
            });
    }

    // properly write the list
    artifactList() {
        return this.state.artifacts.map(function(currArtifact, i){
            return <Artifact artifacts={currArtifact} key={i} />;
        })
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
                        <Form>
                            <Input type="search"
                                   id="search"
                                   className="mr-2"
                                   onChange={this.onChange}
                                   value={this.state.search}
                                   placeholder="Enter keyword or Artifact ID"/>
                        </Form>
                    </Col>
                    <Col>
                        <Form>
                            <button onClick={this.onSubmit}>Search</button>
                        </Form>
                    </Col>
                </Row>
                <Container className="artifactBox">
                    <div>
                        <div className="d-flex justify-content-centre"> <p className="tMHeader">Artifact List</p></div>
                        <table className="table table-striped" size="sm" justify-content-centre>
                            <thead>
                            <tr>
                                <th className="tHeader">Name</th>
                                <th className="tHeader">Story</th>
                                <th className="tHeader">Date Made</th>
                            </tr>
                            </thead>
                            <tbody>
                            { this.artifactList() }
                            </tbody>
                        </table>
                    </div>
                </Container>
            </Container>
        )
    };

}

export default MainSearch;