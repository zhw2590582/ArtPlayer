import { setStyles, includeFromEvent, isMobile } from '../utils';
import Component from '../utils/component';
import playbackRate from './playbackRate';
import aspectRatio from './aspectRatio';
import flip from './flip';
import info from './info';
import version from './version';
import close from './close';

export default class Contextmenu extends Component {
    constructor(art) {
        super(art);

        this.name = 'contextmenu';
        this.$parent = art.template.$contextmenu;

        if (!isMobile) {
            this.init();
        }
    }

    init() {
        const {
            option,
            proxy,
            template: { $player, $contextmenu },
        } = this.art;

        if (option.playbackRate) {
            this.add(
                playbackRate({
                    name: 'playbackRate',
                    index: 10,
                }),
            );
        }

        if (option.aspectRatio) {
            this.add(
                aspectRatio({
                    name: 'aspectRatio',
                    index: 20,
                }),
            );
        }

        if (option.flip) {
            this.add(
                flip({
                    name: 'flip',
                    index: 30,
                }),
            );
        }

        this.add(
            info({
                name: 'info',
                index: 40,
            }),
        );

        this.add(
            version({
                name: 'version',
                index: 50,
            }),
        );

        this.add(
            close({
                name: 'close',
                index: 60,
            }),
        );

        for (let index = 0; index < option.contextmenu.length; index++) {
            this.add(option.contextmenu[index]);
        }

        proxy($player, 'contextmenu', (event) => {
            event.preventDefault();
            if (!this.art.constructor.CONTEXTMENU) return;

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

            setStyles($contextmenu, {
                top: `${menuTop}px`,
                left: `${menuLeft}px`,
            });
        });

        proxy($player, 'click', (event) => {
            if (!includeFromEvent(event, $contextmenu)) {
                this.show = false;
            }
        });

        this.art.on('blur', () => {
            this.show = false;
        });
    }
}
