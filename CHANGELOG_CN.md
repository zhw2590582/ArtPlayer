# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

-   插件 `artplayer-plugin-hls-quality` 添加 `getResolution` 函数选项，用于获取从 `level` 中分辨率的文本
-   新增 `artplayer-plugin-dash-quality` 插件，用于添加 `Dash` 画质列表到播放器
-   修复 `lock` 事件失效问题

## [4.6.2] - 2023-1-26

-   `Artplayer.PROGRESS_HEIGHT` 默认值改为 `6`
-   添加 `artplayer-plugin-vtt-thumbnail` 用于使用 `vtt` 字幕文件生成视频预览图
-   添加 `Artplayer.FULLSCREEN_WEB_IN_BODY` 用于网页全屏时，是否把播放器挂载于 `document.body` 上，默认为 `false`
-   修改字幕偏移的方式为滑块
-   字幕选项添加 `escape`，用于是否转义 `html` 标签，默认为 `true`

## [4.6.1] - 2023-1-11

-   编写全新的文档
-   优化`d.ts`
-   移除多余的事件
-   优化部分样式
-   添加`i18n`选项

## [4.6.0] - 2022-12-31

-   优化控制栏图标的样式效果
-   优化设置面板的样式效果
-   修复 `art.fullscreen` 监听状态错误的问题
-   添加 `artplayer-plugin-control` 插件，用于改变控制栏样式

## [4.5.12] - 2022-11-20

-   修复 `art.loop = []` 的显示 `bug`

## [4.5.11] - 2022-11-6

-   新增 `Artplayer.CONTEXTMENU` 用于设置是否显示右键菜单，默认为 `true`
-   移动设备 `Whitelist` 功能默认为 `true`，即全部移动设备都使用播放器 `UI`

## [4.5.10] - 2022-11-5

-   修复字幕在 `firefox` 不显示的问题：[#pull/415](https://github.com/zhw2590582/ArtPlayer/pull/415)
-   信息弹窗支持点击选中视频属性文本值

## [4.5.9] - 2022-11-5

-   添加 `art.type` 属性，用于获取和设置视频类型
-   添加 `art.video` 属性，用于获取 `video` 元素
-   添加 `artplayer-plugin-iframe` 插件，用于控制 `iframe` 里的播放器
-   添加 `artplayer-plugin-hls-quality` 插件，用于添加 `Hls` 画质列表到播放器
-   新增 `Artplayer.PLAYBACK_RATE` 用于设置默认播放速度，默认 `[0.5, 0.75, 1, 1.25, 1.5, 2]`
-   新增 `Artplayer.ASPECT_RATIO` 用于设置默认长宽比，默认 `['default', '4:3', '16:9']`
-   新增 `Artplayer.FLIP` 用于设置默认翻转功能，默认 `['normal', 'horizontal', 'vertical']`
-   新增 `Artplayer.PROGRESS_HEIGHT` 用于设置进度条高度，默认为 `4`
-   添加 `legacy.js` 版本，用于兼容更老的浏览器，但相对体积较大
-   移除 `examples` 目录，不再提供 `vue.js` 和 `react.js` 的例子文件

## [4.5.8] - 2022-10-9

-   添加 `farsi` 语言
-   新增 `Artplayer.DEBUG` 用于打印 `debug` 信息，默认为 `false`
-   新增 `art.setting.update()` 用于动态更新设置面板
-   优化 `artplayer.d.ts`

## [4.5.7] - 2022-9-28

-   新增 `Artplayer.VOLUME_STEP` 用于控制调整 `音量` 的步长，默认为 `0.1`
-   新增 `Artplayer.SEEK_STEP` 用于控制调整 `快进/快退` 的步长，默认为 `5` 秒
-   修复部分 `svg` 图标在移动端不显示的问题
-   修复在桌面端进度条不能同时点击和拖动的问题
-   修复在移动端进度条不能点击和拖动的问题
-   新增 `art.isRotate` 属性，用于识别是否自动全屏旋转
-   设置面板 `range` 添加 `onChange` 选项，可以实时获取当前值

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    settings: [
        {
            html: 'Slider',
            tooltip: '5x',
            range: [5, 1, 10, 0.1],
            onChange: function (item) {
                return item.range + 'x';
            },
        },
    ],
});
```

## [4.5.6] - 2022-9-19

-   修复 `hls.js` 在 `Safari` 播放失效的问题

## [4.5.5] - 2022-9-19

-   广告插件添加 `option.muted` 选项，用于静音自动播放广告
-   弹幕库插件暴露 `art.plugins.artplayerPluginDanmuku.reset()` 方法，用于清空当前弹幕显示
-   弹幕库插件暴露 `art.plugins.artplayerPluginDanmuku.option` 属性，用于获取当前弹幕配置
-   修复在 `IOS` 全屏模式下，字幕失效的问题
-   添加西班牙语支持

## [4.5.4] - 2022-8-1

### Added

-   新增 `Artplayer.AUTO_PLAYBACK_MIN` 用于控制最小可以记忆播放的进度值，默认为 `5` 秒
-   新增 `Artplayer.TOUCH_MOVE_RATIO` 用于控制移动端进度条拖放比例，默认为 `0.5`
-   `option.thumbnails` 添加可选的 `width` 和 `height`
-   新增播放器编号选项 `option.id`，可用于记忆播放时的唯一标识

## [4.5.3] - 2022-7-13

### Added

-   `url` 选项允许传空字符串，可用于异步设置 `art.url`

```js
const art = new Artplayer({
    url: '',
    container: '.artplayer-app',
});

setTimeout(() => {
    art.url = '/assets/sample/video.mp4';
}, 1000);
```

-   `art.play()` 方法统一返回 `Promise`, `play` 事件也改为异步触发

```js
const art = new Artplayer({
    url: '/assets/sample/video.mp4',
    container: '.artplayer-app',
});

art.on('ready', async () => {
    try {
        await art.play();
        console.log('播放成功');
    } catch (error) {
        console.log('播放失败', error.message);
    }
});
```

-   新增 `airplay` (隔空播放) 功能，当前只在 Safari 下可用

```js
const art = new Artplayer({
    url: '/assets/sample/video.mp4',
    container: '.artplayer-app',
    airplay: true,
});
```

## [4.5.2] - 2022-6-22

### Added

-   优化自动回放功能，让用户自行选择

## [4.5.0] - 2022-6-21

### Added

-   移除内置广告功能
-   新增广告插件

## [4.4.7] - 2022-6-13

### Added

-   兼容弹幕库 d.ts
-   更新依赖库

## [4.4.6] - 2022-6-11

### Added

-   添加弹幕库 d.ts
-   调整字幕字体大小参数
-   优化正则解析 xml 弹幕

## [4.4.5] - 2022-6-2

### Added

-   修复迷你模式时，主题色缺失的 bug

## [4.4.3] - 2022-05-26

### Added

-   修复弹幕库销毁时，自定义挂载输入框的残留
-   修复迷你模式的尺寸计算错误

## [4.4.2] - 2022-05-20

### Added

-   移除播放器 UI 初始化的 video:loadedmetadata 事件
-   弹幕库暴露 load 方法，用于切换弹幕源
-   添加 error 图标，出现于视频加载错误达到上限后
-   修复 setting 多次初始化时产生的 bug

## [4.4.1] - 2022-05-17

### Added

-   添加 art.isInput 属性，当为 true 的时候不自动隐藏控制栏，如弹幕正在输入时
-   添加 art.isLock 属性，在移动端当为 true 的时候不能操作快进、开始和暂停
-   修复弹幕输入框的固定宽度 bug
-   设置面板支持 range 和 onRange 选项
-   添加 isAndroid 和 isIOS 工具函数
-   弹幕库添加 lockTime 选项，可自定义输入框的锁定时间
-   弹幕库添加 maxLength 选项，控制输入最大可输入字数
-   弹幕库添加 minWidth 选项，控制输入框最小宽度
-   弹幕库添加 maxWidth 选项，控制输入框最大宽度
-   弹幕库添加 mount 选项，控制输入框自定义挂载位置
-   弹幕库添加 beforeEmit 选项，控制弹幕发送前的校验
-   弹幕库添加 theme 选项，控制输入框自定义挂载的主题色

## [4.4.0] - 2022-05-15

### Added

-   设置面板支持 switch 和 onSwitch 选项
-   弹幕库插件添加设置面板和弹幕发送
-   弹幕库的选项添加默认模式和默认字号
-   弹幕库字号支持按播放器的百分百
-   修复翻转设置的图标缺失
-   默认播放器获取了焦点后，不会自动隐藏控制栏
-   删除字幕开关按钮，需要自行配置字幕开关
