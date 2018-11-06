import Artplayer from '../src/index';

test('Insert to DOM', t => {
  document.body.innerHTML = '<div class="artplayer-app"></div>';
  const app = new Artplayer({
    container: '.artplayer-app'
  });
});
