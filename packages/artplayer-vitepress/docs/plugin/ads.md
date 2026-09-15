# 视频与 HTML 广告

[English](../en/plugin/ads.md)

在内容首次播放时展示一次前贴片广告，可以使用独立视频或 HTML。插件自带倒计时、关闭、详情、静音和全屏控件，不需要 IMA SDK；VAST 广告请求由另一个 [VAST 插件](./vast.md)处理。本页描述未发布的重构分支，在线示例与未固定版本的包不等于当前候选。

## 安装和示例

```sh
yarn add artplayer artplayer-plugin-ads
```

```js
import Artplayer from 'artplayer';
import artplayerPluginAds from 'artplayer-plugin-ads';
```

使用 script 时先加载 ArtPlayer，再加载 `dist/artplayer-plugin-ads.js`，全局名为 `artplayerPluginAds`。下面保留[原在线示例](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-ads/index.js&example=ads)，其中同时配置 video/html 时使用视频。

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-ads/index.js">▶ Run Code</div>

```js
// npm i artplayer-plugin-ads
// import artplayerPluginAds from 'artplayer-plugin-ads';

const art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/video.mp4',
  autoSize: true,
  fullscreen: true,
  fullscreenWeb: true,
  plugins: [
    artplayerPluginAds({
      // html广告，假如是视频广告则忽略该值
      html: '<img src="/assets/sample/poster.jpg">',

      // 视频广告的地址
      video: '/assets/sample/test1.mp4',

      // 广告跳转网址，为空则不跳转
      url: 'http://artplayer.org',

      // 必须观看的时长，期间不能被跳过，单位为秒
      // 当该值大于或等于totalDuration时，不能提前关闭广告
      // 当该值等于或小于0时，则随时都可以关闭广告
      playDuration: 5,

      // 广告总时长，单位为秒
      totalDuration: 10,

      // 多语言支持
      i18n: {
        close: '关闭广告',
        countdown: '%s秒',
        detail: '查看详情',
        canBeClosed: '%s秒后可关闭广告',
      },
    }),
  ],
})

// 广告被点击
art.on('artplayerPluginAds:click', (ads) => {
  console.info('广告被点击', ads)
})

// 广告被跳过
art.on('artplayerPluginAds:skip', (ads) => {
  console.info('广告被跳过', ads)
})
```

## 配置

配置可省略，也可传入 `{}` 使用默认值。

| 字段 | 类型 | 默认值 | 含义 |
| --- | --- | --- | --- |
| `html` | `string` | `''` | 广告 HTML，可包含图片；不会自动清理 HTML，仅使用可信内容 |
| `video` | `string` | `''` | 广告视频地址，非空时优先于 html |
| `url` | `string` | `''` | 点击广告或详情时打开的地址；为空不跳转并隐藏详情按钮 |
| `playDuration` | `number` | `5` | 关闭按钮开放前的倒计时秒数，不限制应用直接调用 skip |
| `totalDuration` | `number` | `10` | 广告倒计时总秒数，不取广告视频的实际时长 |
| `muted` | `boolean` | `false` | 广告视频初始静音状态 |
| `i18n` | `Translations` | 下表 | 整体替换默认翻译对象，四个字段必须一起提供 |

| 翻译字段 | 默认值 |
| --- | --- |
| `close` | `'关闭广告'` |
| `countdown` | `'%s秒'` |
| `detail` | `'查看详情'` |
| `canBeClosed` | `'%s秒后可关闭广告'` |

`%s` 用于时间替换。配置按浅合并处理，不支持只传一项 i18n。时长应使用数字秒，字符串不进行转换，而是被运行时校验拒绝。`source/type` 只是旧工作区声明遗留字段，不会被当作 video/html 的别名；图片通过 html 的 img 提供。

建议使用正整数时长。`playDuration <= 0` 时可立即用按钮关闭；`playDuration >= totalDuration` 时隐藏提前关闭按钮。倒计时按每次定时器执行累计一秒，页面隐藏时暂停；不是对视频 currentTime 或现实经过时间的精确计费。视频循环播放，广告结束由倒计时或 skip 决定。

## 方法和事件

插件同步注册，结果在 `art.plugins.artplayerPluginAds`，name 固定为 `artplayerPluginAds`。

| 方法 | 实际行为 |
| --- | --- |
| `pause()` | 暂停倒计时，不暂停广告视频 |
| `play()` | 恢复倒计时，不播放广告视频，也不创建重复计时链 |
| `skip()` | 结束广告一次；不受关闭按钮的 playDuration 限制 |

三个方法都同步返回 `undefined`。未初始化时 play/pause 不启动广告，skip 取消尚未显示的前贴片并发出一次 skip 事件，不创建 DOM 或主动开始内容播放。广告结束后重复 skip 无额外效果。

| 播放器事件 | 参数与时机 |
| --- | --- |
| `artplayerPluginAds:click` | 广告内容或可用详情按钮被点击，传入该次归一化配置；有 url 时先请求打开新窗口 |
| `artplayerPluginAds:skip` | 广告完成时传入同一个归一化配置；倒计时结束、手动跳过或媒体失败均可能触发，并非只表示用户点击 |

事件参数不是只读快照，监听器修改其中字段会影响后续读取，例如 totalDuration。实际打开广告详情还受浏览器窗口策略约束。

## 生命周期和媒体

在构造选项中安装插件。插件等到 ready 后的第一次 play 或 video:playing 信号才创建覆盖层并暂停正文；晚于 ready 安装不会补发已经过去的 ready。视频广告等到自己的 metadata 后启动倒计时并请求播放，HTML 广告直接开始计时。

广告视频加载或播放失败会结束广告；内部请求播放的 Promise 拒绝会记录警告。正常结束先请求恢复正文播放，再暂停广告、隐藏覆盖层并同步发出 skip。恢复请求不保证浏览器已经开始播放，应用直接调用 `art.play()` 的拒绝行为也没有改变。

结束后隐藏的广告层保留到播放器销毁。销毁释放广告视频来源、监听器、定时器和覆盖层，并清理自己创建的 `art.template.$ads`；即使保留播放器 HTML 也会清理。插件没有独立公开的 destroy、reset 或再次投放接口。样式沿用 `artplayer-plugin-ads*` 类名；全屏按钮调用核心 fullscreen。

独立广告视频需要浏览器能够加载与解码；主播放器的自定义 SDK/代理不会自动接管它。原生全屏、移动端播放策略及实际媒体效果需要目标环境验收，页面导航通过不代表这些能力已验证。

## TypeScript 兼容

根入口和 `/legacy` 接受旧声明中的 `totalDuration: string`，但运行时仍拒绝字符串。已批准的类型修正使 `Parameters<typeof ads>[0].totalDuration` 读取为 `number | string | undefined`，旧工作区 source/type 也变为可选；依赖过去推导的代码需要缩窄或迁到精确 Option。

新代码可选择相同实现的 `/runtime`：

```ts
import ads from 'artplayer-plugin-ads/runtime';
import type { Option, Result } from 'artplayer-plugin-ads';

const options: Option = { video: '/advertisement.mp4', totalDuration: 10 };
const installAds = ads(options);

function pauseCountdown(plugin: Result): void {
  plugin.pause();
}
```

公开类型包括 Translations、Option、LegacyOption、WorkspaceOption、CompatOption、Result、Callable、Factory、RuntimeCallable、RuntimeFactory。LegacyOption/WorkspaceOption 用于明确表示历史声明，不新增运行时别名。CommonJS 支持函数本身和 `.default(...)`，ESM 使用默认导出；精确入口不是第二套插件实现。
