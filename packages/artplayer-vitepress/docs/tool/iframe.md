# Iframe 通信工具

[English](../en/tool/iframe.md)

在父页面控制 iframe 内的播放器，并把子页面事件传回父页面。它是独立构造器，不是放进 ArtPlayer plugins 数组的插件。本页描述当前未发布分支；父子页面都需要自行部署。

## 安装与双端接入

```sh
yarn add artplayer-tool-iframe
```

父页面使用默认导入 `import ArtplayerToolIframe from 'artplayer-tool-iframe'`。script 使用 `dist/artplayer-tool-iframe.js`，全局名为 `ArtplayerToolIframe`。

子页面也必须加载此工具并主动调用 inject；如果需要创建播放器，还要在子页面加载 ArtPlayer 和提供容器。例如仓库的 `/iframe.html` 使用：

```html
<div class="artplayer-app" style="width:100%;height:100%"></div>
<script src="./uncompiled/artplayer/index.js"></script>
<script src="./uncompiled/artplayer-tool-iframe/index.js"></script>
<script>ArtplayerToolIframe.inject();</script>
```

以上路径属于本站开发输出，部署应用时替换成实际构建路径。下面保留[父页面原始示例](https://artplayer.org/?libs=./uncompiled/artplayer-tool-iframe/index.js&example=iframe)，它创建 iframe 并指向 `/iframe.html`：

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

## 父页面实例

构造参数为 `{ iframe: HTMLIFrameElement, url: string }`，两项必填。构造时设置 iframe.src 并注册消息监听器；不会自动安装子页面脚本。iframe 元素由调用方创建和移除。

| 成员 | 行为 |
| --- | --- |
| `commit(callback)` | 提取函数体字符串，在子页面执行；返回响应 Promise |
| `postMessage({ type, data, id? })` | 向子页面发送请求并等待响应；发送时分配自己的数值 id，忽略传入 id |
| `message(callback)` | 设置一个消息通知回调，后一次覆盖前一次；同步返回 void |
| `onMessage(event)` | 父页面接收器；通常由工具监听原生 message 事件 |
| `destroy()` | 同步、幂等；移除本实例监听和导航观察，拒绝已发送及等待中的请求 |
| `url` / `$iframe` | 初始配置地址及 iframe 元素；修改 url 字段本身不等于导航 |
| `injected` / `destroyed` | 注入及销毁状态 |
| `promises` | 待处理请求对象；历史回调字段拼写为 `resove` 和 `reject` |
| `messageCallback` | 当前通知回调；默认函数，运行时也可为 null |

通知只接收 `{ type, data }`，this 为该工具实例，不带 id 或私有文档标记。匹配请求 id 的非 error 消息会正常结算；error 响应转换为 Error 拒绝。自定义消息类型仍可使用，但子页面需实现对应响应；未响应的请求没有默认超时。

注入前请求每 200ms 检查一次，不在 inject 事件里同步清空队列。数值 id 是关联编号，不保证等于 Date.now。销毁时未完成请求以 `The instance has been destroyed` 拒绝；调用方应处理 Promise 失败。

## commit 的执行方式

普通函数体可 return 可结构化克隆的结果。异步结果使用历史的字面量 `resolve(...)` 约定：

```js
const title = await iframe.commit(() => {
  return document.title; // 在子页面读取
});
const answer = await iframe.commit((resolve) => {
  setTimeout(() => resolve(42), 100);
});
```

函数体通过字符串截取和 new Function 执行，不传递闭包、父页面局部变量、函数参数或 import。保留花括号；不要使用表达式箭头函数、async 函数体、顶层 await，或重命名异步 resolve 参数。该约定使用文本匹配，并非完整 JavaScript 语法分析。返回值需适合 postMessage，Promise 对象本身不能当作普通返回值发送。执行错误会发送 error 响应，子页面接收器也会拒绝。

## 子页面静态方法与信任边界

| 成员 | 行为 |
| --- | --- |
| `ArtplayerToolIframe.iframe` | 只读运行时 getter：当前页面是否位于 iframe 内 |
| `inject()` | 发送注入通知并安装子页面接收器；重复调用保留单份监听 |
| `postMessage({ type, data, id? })` | 向 parent 发送通知/响应，默认 id 为 0，返回 void |
| `onMessage(event)` | 实际为 async 接收器；处理 commit，普通自定义类型需应用处理 |

后三项只能在 iframe 中使用；顶层调用抛错或拒绝。两端检查所选窗口与基本消息形状，继续使用 wildcard targetOrigin，未将初始 URL 的 origin 固定为白名单。父子页面内容必须可信；commit 会执行代码，需要允许对应执行方式的 CSP，它不是隔离沙箱或消息数据验证器。

## 导航、清理和兼容类型

双方升级后会协商文档标记，用于拒绝旧文档响应和取消确认离开页面的请求；标记不是认证凭证。替换 src 暂停发送，确认跨文档离开后取消旧请求；匹配的同文档 hash 变化保留请求。新页面排队请求与旧页面请求区分处理。旧子页面缺少文档标记时，同地址 reload 或内部导航的识别有局限，不能视为已验证 BFCache 恢复。

destroy 不移除 iframe、不销毁其播放器，也不新增静态子页面 destroy API。父页面可在释放工具后自行移除 iframe。独立页面的播放器事件、全屏权限及设备行为需要实际集成测试。

根和 `/legacy` 保留旧类声明，包括必填 Message.data、只读实例字段、同步静态 onMessage 和 `commit` 的 ReturnType 推导。准确运行时视图从同一入口按类型导入；没有 `/runtime` 子路径：

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

公开类型包括 Option、Message、Callbacks、Notification、MessageCallback、OutboundMessage、ProtocolMessage、Resolve、ResolverCallback、RuntimeInstance、ResolverInstance、RuntimeConstructor。类型视图不验证响应数据，也不改变执行协议。现代 CommonJS TS 可用 `import Iframe = require('artplayer-tool-iframe')`；ESM 使用默认导入。构造器没有 `.default` 自引用。旧 `artplayer-plugin-iframe` 的包名、命名空间和独立 helper 不等同于本工具，不能仅换依赖名就认为所有入口兼容。
