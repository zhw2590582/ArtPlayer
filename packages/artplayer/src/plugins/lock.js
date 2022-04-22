import { setStyle } from '../utils';

export default function lock(art) {
    const { layers, icons } = art;

    layers.add({
        name: 'lock',
        html: icons.unlock,
        style: {
            display: 'flex',
            'align-items': 'center',
            'justify-content': 'center',
            position: 'absolute',
            left: '15px',
            top: 'calc(50% - 17px)',
            height: '34px',
            width: '34px',
            color: '#fff',
            'border-radius': '50%',
            'background-color': 'rgb(0 0 0 / 50%)',
        },
        mounted($lock) {
            let timeout = 0;

            art.on('click', () => {
                setStyle($lock, 'display', 'flex');
                timeout = Date.now();
            });

            art.on('video:timeupdate', () => {
                if (art.playing && Date.now() - timeout >= 3000) {
                    setStyle($lock, 'display', 'none');
                }
            });
        },
    });

    return {
        name: 'lock',
    };
}
