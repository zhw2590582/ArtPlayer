import Artplayer from '../index';

test('test', () => {
  document.body.innerHTML = '<div class="artplayer-app"></div>';
  const app = new Artplayer({
    container: '.artplayer-app'
  });
});
