var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  title: '【新海诚动画】『秒速5センチメートル』',
  poster: url + '/image/one-more-time-one-more-chance-poster.jpg',
  volume: 0.5,
  autoplay: true,
  pip: true,
  autoSize: true,
  screenshot: true,
  setting: true,
  loop: true,
  playbackRate: true,
  aspectRatio: true,
  fullscreen: true,
  fullscreenWeb: true,
  mutex: true,
  theme: '#ffad00',
  lang: 'zh-cn',
  moreVideoAttr: {
    'webkit-playsinline': true,
    'playsinline': true
  },
  contextmenu: [
      {
          html: '自定义菜单 - 天亮请关灯 Σ(っ °Д °;)っ',
          click: function() {
            document.querySelector('.video-wrap').classList.toggle('dark');
            this.hide();
          }
      }
  ],
  layers: [
    {
      html: `<img style="width: 100px" src="${url}/image/your-name.png">`,
      click: function () {
        art.destroy(true);
        art = new Artplayer({
            autoplay: true,
            container: '.artplayer-app',
            url: url + '/video/you-name.mp4'
        })
      },
      style: {
          'position': 'absolute',
          'top': '20px',
          'right': '20px',
          'opacity': '.9'
      }
    }
  ],
  quality: [
    {
      default: true,
      name: '标清 480P',
      url: url + '/video/one-more-time-one-more-chance-480p.mp4'
    },
    {
      name: '高清 720P',
      url: url + '/video/one-more-time-one-more-chance-720p.mp4'
    }
  ],
  thumbnails: {
    url: url + '/image/one-more-time-one-more-chance-thumbnails.png',
    width: 190,
    height: 107
  },
  subtitle: {
    url: url + '/subtitle/one-more-time-one-more-chance.srt',
    style: {
      color: '#03A9F4'
    }
  },
  highlight: [
    {
      time: 60,
      text: 'One more chance'
    },
    {
      time: 120,
      text: '谁でもいいはずなのに'
    },
    {
      time: 180,
      text: '夏の想い出がまわる'
    },
    {
      time: 240,
      text: 'こんなとこにあるはずもないのに'
    },
    {
      time: 300,
      text: '－－终わり－－'
    }
  ]
});
