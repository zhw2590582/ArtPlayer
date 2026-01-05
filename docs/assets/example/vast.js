// npm i artplayer-plugin-vast
// import artplayerPluginVast from 'artplayer-plugin-vast';

var art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/video.mp4',
  fullscreenWeb: true,
  plugins: [
    artplayerPluginVast({
      // Optional: Configure IMA settings here if needed
    }),
  ],
  controls: [
    {
      name: 'VAST_LINEAR',
      position: 'right',
      html: 'Linear Ad',
      click: function () {
        var VAST_LINEAR =
          'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';
        art.plugins.artplayerPluginVast.playAdTag(VAST_LINEAR);
      }
    },
  ]
});

art.on('vast:adLoaded', function (event) {
  console.info('vast:adLoaded', event);
});

art.on('vast:adStarted', function (event) {
  console.info('vast:adStarted', event);
});

art.on('vast:adComplete', function (event) {
  console.info('vast:adComplete', event);
});

art.on('vast:adSkipped', function (event) {
  console.info('vast:adSkipped', event);
});

art.on('vast:allAdsCompleted', function () {
  console.info('vast:allAdsCompleted');
});

art.on('vast:adError', function (error) {
  console.error('vast:adError', error);
});