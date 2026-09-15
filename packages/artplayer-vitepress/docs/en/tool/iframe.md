# Iframe communication tool

[简体中文](../../tool/iframe.md)

Control a player inside an iframe and receive child-page notifications. This is a standalone constructor, not an ArtPlayer plugins-array factory. This page describes the unreleased branch; deploy both parent and child pages yourself.

## Install and connect both pages

```sh
yarn add artplayer-tool-iframe
```

The parent uses `import ArtplayerToolIframe from 'artplayer-tool-iframe'`. For scripts, load `dist/artplayer-tool-iframe.js`; its global is `ArtplayerToolIframe`.

The child must also load the tool and call inject. To create a player there, load ArtPlayer and provide a container too. The repository's `/iframe.html` uses:

```html
<div class="artplayer-app" style="width:100%;height:100%"></div>
<script src="./uncompiled/artplayer/index.js"></script>
<script src="./uncompiled/artplayer-tool-iframe/index.js"></script>
<script>ArtplayerToolIframe.inject();</script>
```

These are this site's development paths; replace them with deployed build paths. The [original parent example](https://artplayer.org/?libs=./uncompiled/artplayer-tool-iframe/index.js&example=iframe) below creates an iframe pointing to `/iframe.html`:

<div className="run-code" data-libs="./uncompiled/artplayer-tool-iframe/index.js">▶ Run Code</div>

```js
// npm i artplayer-tool-iframe
// import ArtplayerToolIframe from 'artplayer-tool-iframe';

const $iframe = document.createElement('iframe')
$iframe.allowFullscreen = true
$iframe.width = '100%'
$iframe.height = '100%'

const $container = document.querySelector('.artplayer-app')
$container.innerHTML = ''
$container.appendChild($iframe)

const iframe = new ArtplayerToolIframe({
  iframe: $iframe,
  url: '/iframe.html',
})

window.addEventListener('artplayer:example:cleanup', () => {
  iframe.destroy()
  $iframe.remove()
}, { once: true })

iframe.message(({ type, data }) => {
  switch (type) {
    case 'fullscreenWeb':
      if (data) {
        $iframe.classList.add('fullscreenWeb')
      }
      else {
        $iframe.classList.remove('fullscreenWeb')
      }
      break
    default:
      break
  }
})

iframe.commit(() => {
  const art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreen: true,
    fullscreenWeb: true,
  })

  art.on('fullscreenWeb', (state) => {
    ArtplayerToolIframe.postMessage({
      type: 'fullscreenWeb',
      data: state,
    })
  })
}).catch((error) => {
  if (!iframe.destroyed)
    console.error(error)
})
```

## Parent instance

Both options are required: `{ iframe: HTMLIFrameElement, url: string }`. Construction sets iframe.src and subscribes to messages; it does not install scripts in the child. The caller creates and removes the iframe element.

| Member | Behavior |
| --- | --- |
| `commit(callback)` | Extract the function body and execute it in the child; returns a response Promise |
| `postMessage({ type, data, id? })` | Send a request and await its response; allocate a numeric id when sending, ignoring a supplied id |
| `message(callback)` | Set one notification callback; the next call replaces it; synchronous void |
| `onMessage(event)` | Parent receiver, normally invoked by the installed native message listener |
| `destroy()` | Synchronous and idempotent; remove owned listeners/navigation observation and reject sent/waiting requests |
| `url` / `$iframe` | Initial configured address and element; changing url alone does not navigate |
| `injected` / `destroyed` | Injection and destruction state |
| `promises` | Pending request object, retaining the historical `resove` and `reject` callback keys |
| `messageCallback` | Current callback; initially a function, also nullable at runtime |

Notifications receive only `{ type, data }`, with the tool as this, without id or private document metadata. Any matching non-error response settles its request; error responses reject with Error. Custom message types remain valid, but the application must implement their child responses. There is no default response timeout.

Before injection, requests poll every200ms; inject does not flush them synchronously. IDs are correlation numbers, not necessarily Date.now. Destruction rejects unfinished requests with `The instance has been destroyed`; handle Promise failures.

## How commit executes

A normal function body can return a structured-cloneable result. Asynchronous results use the historical literal `resolve(...)` convention:

```js
const title = await iframe.commit(() => {
  return document.title; // Read in the child page.
});
const answer = await iframe.commit((resolve) => {
  setTimeout(() => resolve(42), 100);
});
```

The body is sliced from a string and evaluated with new Function. Closures, parent locals, function arguments and imports are not transferred. Keep braces; do not use expression arrows, async function bodies, top-level await or a renamed asynchronous resolve parameter. Detection is a text match, not a JavaScript parser. Results must support postMessage; a Promise object itself cannot be sent as a normal result. Execution errors send an error response and also reject the child's receiver.

## Child statics and trust

| Member | Behavior |
| --- | --- |
| `ArtplayerToolIframe.iframe` | Runtime readonly getter: whether this page is inside an iframe |
| `inject()` | Announce injection and install the receiver; repeated calls retain one listener set |
| `postMessage({ type, data, id? })` | Send a parent notification/response; id defaults0; returns void |
| `onMessage(event)` | Actually async; handles commit, while custom types need application handling |

The three methods require an iframe context; top-level use throws or rejects. Receivers check the selected window peer and basic packet shape, retaining wildcard targetOrigin rather than pinning the initial URL's origin. Trust the parent and child content. Commit executes code and requires a compatible CSP; it is neither a sandbox nor a payload validator.

## Navigation, cleanup and types

Upgraded peers negotiate document markers to reject obsolete replies and cancel work when document departure is confirmed. These markers are not authentication credentials. A src replacement pauses sends; confirmed cross-document departure cancels old requests, while a matching same-document hash change preserves them. Work queued for the next page is tracked separately. Legacy children cannot identify same-address reloads or internal navigation reliably; ordinary navigation tests do not establish BFCache restoration.

Destroy does not remove the iframe, destroy its player or provide a new static child destroy method. The parent can remove its iframe after releasing the tool. Player events, fullscreen permissions and physical devices require actual integration checks.

Root and `/legacy` preserve the historical class, including required Message.data, readonly fields, void static onMessage and ReturnType-based commit inference. Import accurate erased views from the same entry; there is no `/runtime` subpath:

```ts
import Iframe from 'artplayer-tool-iframe';
import type { ResolverInstance, RuntimeConstructor } from 'artplayer-tool-iframe';

function connectFrame(element: HTMLIFrameElement) {
  const Runtime = Iframe as RuntimeConstructor;
  const tool = new Runtime({ iframe: element, url: '/iframe.html' }) as ResolverInstance;
  tool.message(function (message) { console.log(this.url, message.type, message.data); });
  const answer = tool.commit<number>((resolve) => { resolve(42); });
  return { tool, answer };
}
```

Public types are Option, Message, Callbacks, Notification, MessageCallback, OutboundMessage, ProtocolMessage, Resolve, ResolverCallback, RuntimeInstance, ResolverInstance and RuntimeConstructor. Views neither validate responses nor alter execution. Modern CommonJS TS can use `import Iframe = require('artplayer-tool-iframe')`; ESM uses the default import. The constructor has no `.default` self-alias. The old `artplayer-plugin-iframe` name, namespace and separate helper are not identical to this tool; renaming the dependency alone does not preserve every old entrypoint.
