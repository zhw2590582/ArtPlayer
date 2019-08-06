import React from 'react';
import Artplayer from '../../artplayer/src';
import '../../artplayer/src/style';

export default class ArtplayerReact extends React.Component {
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
        this.update();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.option !== this.props.option) {
            this.destroy();
            this.update();
        }
    }

    componentWillUnmount() {
        this.destroy();
    }

    update() {
        const { option, getInstance } = this.props;
        this.instance = new Artplayer({
            ...option,
            container: this.artRef.current,
        });

        if (getInstance && typeof getInstance === 'function') {
            getInstance(this.instance);
        }
    }

    destroy() {
        if (this.instance && this.instance.destroy) {
            this.instance.destroy();
        }
    }

    render() {
        const { option, getInstance, ...rest } = this.props;
        return React.createElement('div', {
            ref: this.artRef,
            ...rest,
        });
    }
}
