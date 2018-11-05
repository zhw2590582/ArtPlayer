import config from '../config';
import { sleep } from '../utils';

export default function eventInit(art, player) {
  const { option, events: { proxy, hover }, refs: { $player, $video }, i18n, notice } = art;
  let firstCanplay = false;

  hover($player, () => {
    $player.classList.add('artplayer-hover');
    art.emit('hoverenter');
  }, () => {
    $player.classList.remove('artplayer-hover');
    art.emit('hoverleave');
  });

  proxy($video, 'click', () => {
    player.toggle();
  });

  config.video.events.forEach(eventName => {
    proxy($video, eventName, event => {
      art.emit(`video:${event.type}`, event);
    });
  });

  art.on('video:loadstart', () => {
    art.loading.show();
  });

  art.on('video:loadeddata', () => {
    art.loading.hide();
  });

  art.on('video:waiting', () => {
    art.loading.show();
  });

  art.on('video:seeking', () => {
    art.loading.show();
  });

  art.on('video:canplay', () => {
    if (!firstCanplay) {
      firstCanplay = true;
      art.emit('firstCanplay');
    }

    art.controls.show();
    art.mask.show();
    art.loading.hide();
    if (option.autoplay) {
      player.play();
    }
  });

  art.on('video:playing', () => {
    art.isPlaying = true;
    art.controls.hide();
    art.mask.hide();
  });

  art.on('video:pause', () => {
    art.isPlaying = false;
    art.controls.show();
    art.mask.show();
  });

  art.on('video:ended', () => {
    art.isPlaying = false;
    art.controls.show();
    art.mask.show();
    if (option.loop) {
      player.seek(0);
      player.play();
    }
  });

  art.on('video:error', () => {
    if (player.reconnectTime < player.maxReconnectTime) {
      sleep(1000).then(() => {
        player.reconnectTime++;
        $video.src = option.url;
        notice.show(`${i18n.get('Reconnect')}: ${player.reconnectTime}`);
      });
    } else {
      art.isError = true;
      art.isPlaying = false;
      art.loading.hide();
      art.controls.hide();
      $player.classList.add('artplayer-error');
      sleep(1000).then(() => {
        notice.show(i18n.get('Video load failed'), false);
        art.destroy();
      });
    }
  });
}
