import { def } from '../utils';

export default function exclusiveMix(art) {
    const sizeProps = ['mini', 'pip', 'fullscreen', 'fullscreenWeb'];

    function exclusive(props) {
        for (let index = 0; index < props.length; index++) {
            const name = props[index];
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
        }
    }

    exclusive(sizeProps);

    def(art, 'normalSize', {
        get() {
            return sizeProps.every((name) => !art[name]);
        },
    });
}
