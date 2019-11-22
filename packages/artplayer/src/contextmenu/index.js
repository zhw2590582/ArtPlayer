import { setStyle } from '../utils';
import Component from '../utils/component';
import playbackRate from './playbackRate';
import aspectRatio from './aspectRatio';
import info from './info';
import version from './version';
import close from './close';

export default class Contextmenu extends Component {
    constructor(art) {
        super(art);

        this.$parent = art.template.$contextmenu;

        art.on('ready', () => {
            const {
                option,
                template: { $player, $contextmenu },
                events: { proxy },
            } = art;

            this.add(
                playbackRate({
                    disable: !option.playbackRate,
                    name: 'playbackRate',
                    index: 10,
                }),
            );

            this.add(
                aspectRatio({
                    disable: !option.aspectRatio,
                    name: 'aspectRatio',
                    index: 20,
                }),
            );

            this.add(
                info({
                    disable: false,
                    name: 'info',
                    index: 30,
                }),
            );

            this.add(
                version({
                    disable: false,
                    name: 'version',
                    index: 40,
                }),
            );

            this.add(
                close({
                    disable: false,
                    name: 'close',
                    index: 50,
                }),
            );

            option.contextmenu.forEach(item => {
                this.add(item);
            });

            proxy($player, 'contextmenu', event => {
                event.preventDefault();
                this.show = true;

                const mouseX = event.clientX;
                const mouseY = event.clientY;
                const { height: cHeight, width: cWidth, left: cLeft, top: cTop } = $player.getBoundingClientRect();
                const { height: mHeight, width: mWidth } = $contextmenu.getBoundingClientRect();
                let menuLeft = mouseX - cLeft;
                let menuTop = mouseY - cTop;

                if (mouseX + mWidth > cLeft + cWidth) {
                    menuLeft = cWidth - mWidth;
                }

                if (mouseY + mHeight > cTop + cHeight) {
                    menuTop = cHeight - mHeight;
                }

                setStyle($contextmenu, 'left', `${menuLeft}px`);
                setStyle($contextmenu, 'top', `${menuTop}px`);
            });

            proxy($player, 'click', event => {
                if (!event.composedPath().includes($contextmenu)) {
                    this.show = false;
                }
            });

            art.on('blur', () => {
                this.show = false;
            });
        });
    }
}
