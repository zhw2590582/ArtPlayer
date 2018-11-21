import { append, clamp, secondToTime, setStyle, getStyle } from '../utils';

export default class Progress {
    constructor(option) {
        this.option = option;
        this.isDroging = false;
        this.set = this.set.bind(this);
    }

    apply(art, $control) {
        this.art = art;
        this.$control = $control;
        const {
            option: { highlight, theme },
            events: { proxy },
            player,
        } = art;

        append(
            $control,
            `
              <div class="art-control-progress-inner">
                <div class="art-progress-loaded"></div>
                <div class="art-progress-played" style="background: ${theme}"></div>
                <div class="art-progress-highlight"></div>
                <div class="art-progress-indicator" style="background: ${theme}"></div>
                <div class="art-progress-tip art-tip"></div>
              </div>
            `,
        );

        this.$loaded = $control.querySelector('.art-progress-loaded');
        this.$played = $control.querySelector('.art-progress-played');
        this.$highlight = $control.querySelector('.art-progress-highlight');
        this.$indicator = $control.querySelector('.art-progress-indicator');
        this.$tip = $control.querySelector('.art-progress-tip');

        highlight.forEach(item => {
            const left = (clamp(item.time, 0, player.duration) / player.duration) * 100;
            append(
                this.$highlight,
                `<span data-text="${item.text}" data-time="${item.time}" style="left: ${left}%"></span>`,
            );
        });

        this.set('loaded', player.loaded);

        this.art.on('video:progress', () => {
            this.set('loaded', player.loaded);
        });

        this.art.on('video:timeupdate', () => {
            this.set('played', player.played);
        });

        this.art.on('video:ended', () => {
            this.set('played', 1);
        });

        proxy($control, 'mousemove', event => {
            setStyle(this.$tip, 'display', 'block');
            if (event.composedPath().indexOf(this.$highlight) > -1) {
                this.showHighlight(event);
            } else {
                this.showTime(event);
            }
        });

        proxy($control, 'mouseout', () => {
            setStyle(this.$tip, 'display', 'none');
        });

        proxy($control, 'click', event => {
            if (event.target !== this.$indicator) {
                const { second, percentage } = this.getPosFromEvent(event);
                this.set('played', percentage);
                player.seek(second);
            }
        });

        proxy(this.$indicator, 'mousedown', () => {
            this.isDroging = true;
        });

        proxy(document, 'mousemove', event => {
            if (this.isDroging) {
                const { second, percentage } = this.getPosFromEvent(event);
                this.$indicator.classList.add('art-show-indicator');
                this.set('played', percentage);
                player.seek(second);
            }
        });

        proxy(document, 'mouseup', () => {
            if (this.isDroging) {
                this.isDroging = false;
                this.$indicator.classList.remove('art-show-indicator');
            }
        });
    }

    showHighlight(event) {
        const { text, time } = event.target.dataset;
        this.$tip.innerHTML = text;
        const left =
            (Number(time) / this.art.player.duration) * this.$control.clientWidth +
            event.target.clientWidth / 2 -
            this.$tip.clientWidth / 2;
        setStyle(this.$tip, 'left', `${left}px`);
    }

    showTime(event) {
        const { width, time } = this.getPosFromEvent(event);
        const tipWidth = this.$tip.clientWidth;
        this.$tip.innerHTML = time;
        if (width <= tipWidth / 2) {
            setStyle(this.$tip, 'left', 0);
        } else if (width > this.$control.clientWidth - tipWidth / 2) {
            setStyle(this.$tip, 'left', `${this.$control.clientWidth - tipWidth}px`);
        } else {
            setStyle(this.$tip, 'left', `${width - tipWidth / 2}px`);
        }
    }

    getPosFromEvent(event) {
        const {
            player,
            refs: { $progress },
        } = this.art;
        const { left } = $progress.getBoundingClientRect();
        const width = clamp(event.x - left, 0, $progress.clientWidth);
        const second = (width / $progress.clientWidth) * player.duration;
        const time = secondToTime(second);
        const percentage = clamp(width / $progress.clientWidth, 0, 1);
        return { second, time, width, percentage };
    }

    set(type, percentage) {
        setStyle(this[`$${type}`], 'width', `${percentage * 100}%`);
        if (type === 'played') {
            setStyle(
                this.$indicator,
                'left',
                `calc(${percentage * 100}% - ${getStyle(this.$indicator, 'width') / 2}px)`,
            );
        }
    }
}
