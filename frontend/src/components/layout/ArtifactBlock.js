import React, {Component} from 'react';
import isEmpty from 'is-empty';



class ArtifactBlock extends Component {

    constructor(props) {
        super(props);
        this.state = {
            artifactData: {}
        }
    }

    componentDidMount() {
        this.setState({
            artifactData: this.props.artifactData
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.artifactData !== this.props.artifactData) {
            this.setState({
                artifactData: this.props.artifactData[0]
            });
        }
    }

    render() {
        var hasData = !isEmpty(this.state.artifactData) ? this.state.artifactData : false;
        return(
            <div>

                {hasData.name}
            </div>
        );
    }
}

export default ArtifactBlock;