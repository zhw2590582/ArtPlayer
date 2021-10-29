import { queryAll } from './utils';
import Component from './utils/component';

export default class Info extends Component {
    constructor(art) {
        super(art);
        this.art = art;
        this.name = 'info';
        if (this.art.template.$info) {
            this.init();
        }
    }

    init() {
        const {
            template: { $infoPanel, $infoClose, $video },
            events: { proxy },
        } = this.art;

        proxy($infoClose, 'click', () => {
            this.show = false;
        });

        let timer = null;
        const types = queryAll('[data-video]', $infoPanel);

        this.art.on('destroy', () => {
            clearTimeout(timer);
        });

        function loop() {
            types.forEach((item) => {
                const value = $video[item.dataset.video];
                item.innerText = typeof value === 'number' ? value.toFixed(2) : value;
            });
            timer = setTimeout(() => {
                loop();
            }, 1000);
        }

        this.art.on('info', (value) => {
            clearTimeout(timer);
            if (value) {
                loop();
            }
        });
    }
}
