var url = 'https://blog.zhw-island.com/assets-cdn';
var app = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  title: '【新海诚动画】『秒速5センチメートル』',
  poster: url + '/image/one-more-time-one-more-chance-poster.jpg',
  pip: true,
  theme: '#ffad00',
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
