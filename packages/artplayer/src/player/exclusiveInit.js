import { def } from '../utils';

export default function exclusiveInit(art, player) {
    const sizeProps = ['mini', 'pip', 'fullscreen', 'fullscreenWeb'];

    function exclusive(props) {
        props.forEach((name) => {
            art.on(name, () => {
                if (player[name]) {
                    props
                        .filter((item) => item !== name)
                        .forEach((item) => {
                            if (player[item]) {
                                player[item] = false;
                            }
                        });
                }
            });
        });
    }

    exclusive(sizeProps);

    def(player, 'normalSize', {
        get() {
            return sizeProps.every((name) => !player[name]);
        },
    });
}
