import config from '../config';
import { sleep } from '../utils';

export default function eventInit(art, player) {
  const { option, events: { proxy }, refs: { $player, $video }, i18n, notice } = art;
  let firstCanplay = false;
  let reconnectTime = 0;
  const maxReconnectTime = 5;

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

  art.on('video:loadedmetadata', () => {
    if (option.autoSize) {
      player.autoSize();
    }
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
    reconnectTime = 0;
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
    if (reconnectTime < maxReconnectTime) {
      sleep(1000).then(() => {
        player.reconnectTime++;
        art.emit('beforeMountUrl', option.url);
        $video.src = player.mountUrl(option.url);
        notice.show(`${i18n.get('Reconnect')}: ${reconnectTime}`);
      });
    } else {
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
