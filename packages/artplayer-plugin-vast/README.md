# artplayer-plugin-vast

A Google IMA SDK integration for ArtPlayer to support VAST and VMAP video ads.

## Features

*   **Google IMA SDK Integration**: Uses the official Google Interactive Media Ads SDK.
*   **Linear Video Ads**: Supports VAST and VMAP linear video advertisements.
*   **Mobile Support**: Designed to work on mobile browsers (iOS Safari / Android Chrome) when triggered correctly.
*   **Lifecycle Management**: Automatically pauses/resumes content and manages player UI during ad breaks.
*   **Error Recovery**: Ensures the main video content resumes if an ad fails to load or play.

## Non-features / Limitations

This plugin is strictly for linear video ads. It does **not** support:

*   **No HTML Ads**: Non-linear HTML overlays are not supported.
*   **No Image Ads**: Static image banners are not supported.
*   **No Companion Ads**: Companion banners outside the player are not supported.
*   **No VPAID**: VPAID (interactive ads) is explicitly disabled.
*   **No Automatic Scheduling**: The plugin does not handle ad scheduling (pre-roll, mid-roll, post-roll).
*   **Manual Triggering Only**: Ads must be triggered manually by the host application via API calls.

## Installation

```bash
npm install artplayer-plugin-vast
```

## Basic Usage

```javascript
import Artplayer from 'artplayer';
import artplayerPluginVast from 'artplayer-plugin-vast';

const art = new Artplayer({
    container: '.artplayer-app',
    url: 'path/to/video.mp4',
    plugins: [
        artplayerPluginVast({
            // Optional IMA SDK settings
        }),
    ],
});

// Example: Trigger an ad on a button click
document.getElementById('play-ad-btn').addEventListener('click', () => {
    if (art.plugins.artplayerPluginVast) {
        art.plugins.artplayerPluginVast.playAdTag(
            'https://pubads.g.doubleclick.net/gampad/ads?...'
        );
    }
});
```

## iOS / Mobile Safari Notice

⚠️ **Important for Mobile Development**

On iOS Safari and many mobile browsers, video playback (including ads) requires a direct user interaction (e.g., a `click` or `touchend` event).

*   **Do not** call `playAdTag()` automatically on page load.
*   **Do not** call `playAdTag()` inside asynchronous callbacks (like `setTimeout` or `fetch` promises) that are detached from the original user event.
*   Always trigger ads inside a direct event listener (e.g., a "Play" button click).

Failure to follow this will result in the ad failing to play or the IMA SDK throwing an error.

## API Reference

The plugin exposes the following methods via `art.plugins.artplayerPluginVast`:

### `playAdTag(url, options?)`

Requests and plays an ad from a VAST tag URL.

*   `url` (string): The VAST ad tag URL.
*   `options` (object): Optional `AdsRequest` configuration properties.

### `playAdsResponse(xml, options?)`

Requests and plays an ad from a raw VAST XML string.

*   `xml` (string): The VAST XML content.
*   `options` (object): Optional `AdsRequest` configuration properties.

### `init()`

Manually initializes the IMA SDK. Usually called automatically, but exposed for advanced preloading scenarios.

### `destroy()`

Destroys the current ad session, cleans up the IMA SDK instances, and removes the ad container.

## Events

The plugin emits the following events on the ArtPlayer instance:

| Event Name | Description |
| :--- | :--- |
| `vast:adLoaded` | Fired when ad data has been loaded. |
| `vast:adStarted` | Fired when the ad actually starts playing. |
| `vast:adComplete` | Fired when a single ad completes. |
| `vast:adSkipped` | Fired when the user skips the ad. |
| `vast:allAdsCompleted` | Fired when all ads in the current break (or VMAP) are finished. |
| `vast:adError` | Fired when an error occurs. The main video will resume automatically. |

## Lifecycle & Behavior Notes

*   **Single Session**: The plugin handles one ad request at a time. Calling `playAdTag` while an ad is loading or playing will be ignored.
*   **UI Hijacking**: During ad playback, the plugin disables the ArtPlayer controls, hotkeys, and scrubbing to prevent user interference.
*   **Content Resume**: The main video content is guaranteed to resume after the ad finishes, is skipped, or if an error occurs.

## Compatibility

*   **ArtPlayer**: Version 5.x or higher.
*   **Browsers**: Modern Chrome, Firefox, Safari, Edge.
*   **Mobile**: iOS Safari and Android Chrome (requires user interaction).

## License

MIT
