import { def } from '../utils';

export default function exclusiveMix(art) {
    const sizeProps = ['mini', 'pip', 'fullscreen', 'fullscreenWeb'];

    function exclusive(props) {
        props.forEach((name) => {
            art.on(name, () => {
                if (art[name]) {
                    props
                        .filter((item) => item !== name)
                        .forEach((item) => {
                            if (art[item]) {
                                art[item] = false;
                            }
                        });
                }
            });
        });
    }

    exclusive(sizeProps);

    def(art, 'normalSize', {
        get() {
            return sizeProps.every((name) => !art[name]);
        },
    });
}
