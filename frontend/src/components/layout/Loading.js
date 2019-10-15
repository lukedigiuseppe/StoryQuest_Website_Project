import React, {Component} from 'react';
import {Helmet} from 'react-helmet';
import {Container, Spinner} from 'reactstrap';

import '../../css/loading.css'

const LOGO = '/images/storyQuest.png';

// This component displays a simple loading message for when the app is loading.

class Loading extends Component {
    
    render() {
        return (
            <div>
                <Helmet> 
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                    <title>Loading. Please wait...</title>
                </Helmet>

                <div className="text-center loading-box bg-light">
                    <Container>
                        <h1><img className="mb-4" src={LOGO} alt="" width="108" height="108" /></h1>
                        <h1>Currently loading Please wait...</h1>
                        <Spinner style={{ width: '50px', height: '50px' }} />
                    </Container>
                </div>

            </div>
        )
    }
}

export default Loading;