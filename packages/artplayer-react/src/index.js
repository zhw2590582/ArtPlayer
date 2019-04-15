import React, { Component } from 'react';
import Artplayer from 'artplayer';

export default class ArtplayerComponent extends Component {
    constructor(props) {
        super(props);
        Artplayer.utils.errorHandle(
            props.option && typeof props.option === 'object',
            "The prop 'option' object cannot be missing",
        );
        this.instance = null;
        this.artRef = React.createRef();
    }

    componentDidMount() {
        const { option, getInstance } = this.props;
        this.instance = new Artplayer({
            ...option,
            container: this.artRef,
        });

        if (getInstance && typeof getInstance === 'function') {
            getInstance(this.instance);
        }
    }

    componentWillUnmount() {
        if (this.instance && this.instance.destroy) {
            this.instance.destroy();
        }
    }

    render() {
        const { option, getInstance, ...rest } = this.props;
        return <div ref={this.artRef} {...rest} />;
    }
}
