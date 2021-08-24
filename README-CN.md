# ArtPlayer.js

> :art: ArtPlayer.js 是一个现代全功能的 HTML5 视频播放器

[![Build Status](https://www.travis-ci.org/zhw2590582/ArtPlayer.svg?branch=master)](https://www.travis-ci.org/zhw2590582/ArtPlayer)
![version](https://badgen.net/npm/v/artplayer)
![license](https://badgen.net/npm/license/artplayer)
![size](https://badgen.net/bundlephobia/minzip/artplayer)
[![npm Downloads](https://img.shields.io/npm/dt/artplayer.svg)](https://www.npmjs.com/package/artplayer)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/354e9953b70a4791a5a46194d587c707)](https://www.codacy.com/app/zhw2590582/ArtPlayer?utm_source=github.com&utm_medium=referral&utm_content=zhw2590582/ArtPlayer&utm_campaign=Badge_Grade)

![Screenshot](./images/screenshot.png)

## Features

-   <b>大小</b> - 缩小并压缩后的大小只有`25kb`
-   <b>字幕</b> - 支持 `.VTT`, `.ASS` 和 `.SRT` 格式
-   <b>自定义</b> - `右键菜单`, `业务图层`, `视频控制器` 和 `设置面板`
-   <b>控制器</b> - `画质切换`, `字幕切换`, `播放速度`, `长宽比`, `视频翻转`, `全屏`, `画中画`, `截图`, `缩略图`, `自适应尺寸`, `高亮` 和 `热键`...
-   <b>内建</b> - `打开本地字幕`, `打开本地视频`, `迷你进度条`, `网络监测` 和 `字幕时间偏移`
-   <b>集成</b> - 容易与其它依赖集成：`flv.js`, `hls.js`, `dash.js`, `shaka-player`, `webtorrent`...
-   <b>代码</b> - 纯 `ES6` 和 `SASS`, 高解耦的代码, 清晰的结构, 容易跟踪 `Bug` 和添加新功能
-   <b>文档</b> - 详尽的接口文档和丰富的代码演示
-   <b>接口</b> - 丰富的接口和响应事件, 容易对接到业务或者自定义插件
-   <b>多语言</b> - 支持控件的国际化

## 生态

| 项目                                                                                                                  | 描述              | 演示                                                                                                                                        |
| --------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| [artplayer-plugin-danmuku](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-plugin-danmuku)     | 弹幕库插件        | [demo](https://artplayer.org/?libs=.%2Funcompiled%2Fartplayer-plugin-danmuku.js&example=danmuku)                                            |
| [artplayer-plugin-gif](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-plugin-gif)             | GIF 生成插件      | [demo](https://artplayer.org/?libs=.%2Funcompiled%2Fartplayer-plugin-gif.js&example=gif)                                                    |
| [artplayer-plugin-backlight](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-plugin-backlight) | 背光插件          | [demo](https://artplayer.org/?libs=.%2Funcompiled%2Fartplayer-plugin-backlight.js&example=backlight)                                        |
| [artplayer-tool-thumbnail](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-tool-thumbnail)     | 缩略图生成工具    | [demo](https://artplayer.org/?libs=.%2Funcompiled%2Fartplayer-tool-thumbnail.js&example=thumbnail)                                          |
| [artplayer-tool-github](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-tool-github)           | Github 弹幕库工具 | [demo](https://artplayer.org/?libs=.%2Funcompiled%2Fartplayer-tool-github.js%0A.%2Funcompiled%2Fartplayer-plugin-danmuku.js&example=github) |  |
| [artplayer-react](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-react)                       | React 组件        | [demo](https://codesandbox.io/s/n74859y9rl)                                                                                                 |
| [artplayer-vue](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-vue)                           | Vue 组件          | [demo](https://codesandbox.io/s/thirsty-sunset-3lz7m)                                                                                       |

## 主页

[https://artplayer.org](https://artplayer.org)

## 手机端演示

![mobile](./images/mobile.png)

## 文档

[https://artplayer.org/document](https://artplayer.org/document)

## 安装

通过 `npm` 安装：

```bash
$ npm install artplayer
```

或者通过 `yarn` 安装：

```bash
$ yarn add artplayer
```

```js
import Artplayer from 'artplayer';
```

或者直接引入`umd`文件：

```html
<script src="path/to/artplayer.js"></script>
```

或者从 jsDelivr CDN 引入:

```html
<script src="https://cdn.jsdelivr.net/npm/artplayer/dist/artplayer.js"></script>
```

将会导出全局变量到`window.Artplayer`.

## 使用

```html
<div class="artplayer-app"></div>
```

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: 'path/to/video.mp4',
});
```

## 贡献

安装依赖：

```bash
$ npm install
$ npm run bootstrap
```

运行开发人员模式，然后选择要开发的项目：

```bash
$ npm run dev
```

开启网页服务器：

```bash
$ npm start
```

## 捐助

我们通过这些渠道接受捐赠：

-   [Patreon](https://www.patreon.com/artplayer)
-   [Paypal](https://www.paypal.me/harveyzack)
-   [微信支付](./images/wechatpay.jpg)
-   [支付宝](./images/alipay.jpg)

## QQ 群

![QQ Group](./images/qqgroup.png)

## 证书

MIT © [Harvey Zack](https://sleepy.im/)
