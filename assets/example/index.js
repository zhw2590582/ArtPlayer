var art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/video.mp4',
  poster: '/assets/sample/poster.jpg',
  volume: 0.5,
  isLive: false,
  muted: false,
  autoplay: false,
  pip: true,
  autoSize: true,
  autoMini: true,
  screenshot: true,
  setting: true,
  loop: true,
  flip: true,
  playbackRate: true,
  aspectRatio: true,
  fullscreen: true,
  fullscreenWeb: true,
  subtitleOffset: true,
  miniProgressBar: true,
  mutex: true,
  backdrop: true,
  playsInline: true,
  autoPlayback: true,
  airplay: true,
  theme: '#23ade5',
  lang: navigator.language.toLowerCase(),
  moreVideoAttr: {
    crossOrigin: 'anonymous',
  },
  settings: [
    {
      width: 200,
      html: 'Subtitle',
      tooltip: 'Bilingual',
      icon: '<img width="22" height="22" src="/assets/img/subtitle.svg">',
      selector: [
        {
          html: 'Display',
          tooltip: 'Show',
          switch: true,
          onSwitch(item) {
            item.tooltip = item.switch ? 'Hide' : 'Show'
            art.subtitle.show = !item.switch
            return !item.switch
          },
        },
        {
          default: true,
          html: 'Bilingual',
          url: '/assets/sample/subtitle.srt',
        },
        {
          html: 'Chinese',
          url: '/assets/sample/subtitle.cn.srt',
        },
        {
          html: 'Japanese',
          url: '/assets/sample/subtitle.jp.srt',
        },
      ],
      onSelect(item) {
        art.subtitle.switch(item.url, {
          name: item.html,
        })
        return item.html
      },
    },
    {
      html: 'Switcher',
      icon: '<img width="22" height="22" src="/assets/img/state.svg">',
      tooltip: 'OFF',
      switch: false,
      onSwitch(item) {
        item.tooltip = item.switch ? 'OFF' : 'ON'
        console.info('You clicked on the custom switch', item.switch)
        return !item.switch
      },
    },
    {
      html: 'Slider',
      icon: '<img width="22" height="22" src="/assets/img/state.svg">',
      tooltip: '5x',
      range: [5, 1, 10, 0.1],
      onRange(item) {
        return `${item.range[0]}x`
      },
    },
    {
      html: 'Button',
      icon: '<img width="22" height="22" src="/assets/img/state.svg">',
      tooltip: 'tooltip',
      onClick() {
        return 'Button clicked'
      },
    },
  ],
  contextmenu: [
    {
      html: 'Custom menu',
      click(contextmenu) {
        console.info('You clicked on the custom menu')
        contextmenu.show = false
      },
    },
  ],
  layers: [
    {
      html: '<img width="100" src="/assets/sample/layer.png">',
      click() {
        window.open('https://aimu.app')
        console.info('You clicked on the custom layer')
      },
      style: {
        position: 'absolute',
        top: '20px',
        right: '20px',
        opacity: '.9',
      },
    },
  ],
  quality: [
    {
      default: true,
      html: 'SD 480P',
      url: '/assets/sample/video.mp4?q=480',
    },
    {
      html: 'HD 720P',
      url: '/assets/sample/video.mp4?q=720',
    },
  ],
  thumbnails: {
    url: '/assets/sample/thumbnails.png',
    number: 60,
    column: 10,
    scale: 0.85,
  },
  subtitle: {
    url: '/assets/sample/subtitle.srt',
    type: 'srt',
    style: {
      color: '#fe9200',
      fontSize: '20px',
    },
    encoding: 'utf-8',
  },
  highlight: [
    {
      time: 15,
      text: 'One more chance',
    },
    {
      time: 30,
      text: '谁でもいいはずなのに',
    },
    {
      time: 45,
      text: '夏の想い出がまわる',
    },
    {
      time: 60,
      text: 'こんなとこにあるはずもないのに',
    },
    {
      time: 75,
      text: '终わり',
    },
  ],
  controls: [
    {
      position: 'right',
      html: 'Control',
      index: 1,
      tooltip: 'Control Tooltip',
      style: {
        marginRight: '20px',
      },
      click() {
        console.info('You clicked on the custom control')
      },
    },
  ],
  icons: {
    loading: '<img src="/assets/img/ploading.gif">',
    state: '<img width="150" height="150" src="/assets/img/state.svg">',
    indicator: '<img width="16" height="16" src="/assets/img/indicator.svg">',
  },
})
