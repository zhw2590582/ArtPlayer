# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
-   修复当网页没有head时,弹幕插件和章节插件引起的样式加载失败问题

## [5.2.2] - 2025-01-19

-   修复缩略图跨越问题
-   修复当网页没有head时引起的样式加载失败问题
-   新增字幕插件的设置面板的滑块支持移动端拖动
-   修复设置面板在旋屏时的定位错误
-   修复全屏状态变化时类名切换错误问题

## [5.2.1] - 2024-10-26

-   重构 `Setting` 组件，修复状态丢失的问题
-   类型是 `range` 的 `Setting`，现在回调函数返回的 `range` 是数字的数组，不再是单一数字
-   删除 `isStringOrNumber` 工具函数
-   修复 `artplayer-plugin-hls-control` 状态不统一的问题
-   废弃 `artplayer-plugin-dash-quality` 插件
-   新增 `artplayer-plugin-dash-control` 插件
-   使用 `code` 替代已废弃的`keyCode` 监听键盘事件
-   新增 `keydown` 事件，监听来自 `document` 的 `keydown` 事件

## [5.2.0] - 2024-10-19

-   新增 `option.proxy` 选项，用于代理第三方的 `video` 和 `canvas`
-   新增 `artplayer-proxy-canvas` 代理，可以使用 `canvas` 播放视频
-   新增 `artplayer-proxy-webav` 代理，来自 [bilibili/WebAV](https://github.com/bilibili/WebAV)
-   新增 `option.thumbnails.scale`, 用于预览图缩放
-   修复 `art.url` 更改不能触发 `autoPlayBack` 的 `bug`: [#797](https://github.com/zhw2590582/ArtPlayer/issues/797)
-   新增 `art.subtitle.cues` 属性, 获取整体的字幕列表
-   新增 `art.subtitle.activeCues` 属性, 获取活跃的字幕列表
-   新增 `subtitleBeforeUpdate` 事件, 在字幕元素渲染前触发
-   修改 `subtitleUpdate` 事件为 `subtitleAfterUpdate`, 在字幕元素渲染后触发
-   优化 `subtitleLoad` 事件的触发时机和回调参数
-   删除 `subtitleSwitch` 事件，请使用 `subtitleLoad` 代替
-   升级 `artplayer-plugin-hls-quality` 为 `artplayer-plugin-hls-control`
-   新增 `artplayer-plugin-ambilight` 插件
-   修复 `thumbnails` 显示 bug

## [5.1.7] - 2024-8-15

-   新增 `Artplayer.STYLE` 属性，返回播放器样式文本
-   `art.screenshot('your-name')` 截图功能支持自定义文件名字
-   `Artplayer.CONTEXTMENU` 为 `false` 时，不再隐藏默认右键菜单
-   新增 `art.thumbnails` 属性，用于动态设置 `thumbnails`

## [5.1.6] - 2024-6-15

-   优化 `setBar` 事件
-   新增 `artplayerPluginChapter` 插件
-   新增 `art.plugins.artplayerPluginDanmuku.load(target)` 参数，用于追加弹幕库
-   新增弹幕插件的 `width` 选项参数，当播放器宽度小于此值时，弹幕发射器置于播放器底部
-   修复 `artplayerPluginVttThumbnail` 在移动端不显示的问题
-   修复弹幕插件样式，和字号百分比显示的 `bug`
-   移动端也可以看到 `thumbnails` 了
-   恢复 `screen.orientation.lock` 功能

## [5.1.5] - 2024-6-1

-   重构 `artplayerPluginDanmuku` 插件
-   新增 `artplayerPluginChromecast` 插件
-   添加 `fullscreenError` 事件
-   优化双击事件: [#728](https://github.com/zhw2590582/ArtPlayer/pull/728)
-   修复 `thumbnails` 延迟显示问题
-   新增 `art.plugins.lock.state = true/false`, 用于手动控制 `lock` 状态
-   当鼠标在控制栏上，或者打开了设置面板，控制栏不再自动隐藏
-   由于兼容性不足，删除 `screen.orientation.lock` 功能
-   修复移动端的 `fullscreen` bug

## [5.1.1] - 2024-1-11

-   插件函数支持同步和异步返回

## [5.1.0] - 2023-12-23

-   插件函数改为支持异步返回
-   当播放地址发生错误到达上限后，不会再主动销毁播放器
-   分离语言文件，核心代码不再捆绑多国语言 [语言设置](https://artplayer.org/document/start/i18n.html)
-   更新组件时，支持填写只更新的字段 [pull/549](https://github.com/zhw2590582/ArtPlayer/pull/549)
-   添加 `muted` 事件，当静音的状态变化时触发
-   添加 `Artplayer.LOG_VERSION` 全局配置，设置是否打印播放器版本，默认为 `true`
-   添加 `Artplayer.USE_RAF` 全局配置，设置是否使用 `requestAnimationFrame` ，默认为 `false`，目前主要用于进度条的平滑效果
-   移除默认样式 `margin:0;padding:0;`，因为容易与第三方库起样式冲突，导致难以覆写
-   字幕行从 `p` 标签改为 `div` 标签，并且添加类名 `art-subtitle-line`
-   在移动端，点击视频会切换控制栏的显示与隐藏
-   由于功能不常用，删除 `art.loop` 区间播放功能
-   字幕轨添加 `label` 属性，用于在移动设备上显示字幕名字
-   添加 `unescape`, `isBrowser`, `setStyleText` 工具函数
-   添加 `artplayerPluginMultipleSubtitles` 插件，用于显示合并后的字幕文件: [demo](https://www.artplayer.org/?libs=./uncompiled/artplayer-plugin-multiple-subtitles/index.js&example=multiple.subtitles)
-   修改迷你进度条的显示方式

## [5.0.9] - 2023-5-14

-   修复 `art.autoOrientation` 样式错误问题
-   移除播放器容器的动画效果

## [5.0.8] - 2023-5-13

-   修复 `art.mini` 的互斥关系
-   修复 `art.aspectRatio` 动画效果问题

## [5.0.7] - 2023-5-13

-   使用 `switchUrl` 或者 `switchQuality` 方法切换地址后会保持原有的调整如：`aspectRatio`, `playbackRate`, `flip`, `autoSize`
-   删除 `switchUrl` 方法和 `switchQuality` 方法的第二个 `name` 参数
-   添加 `isIOS13` 工具，用于修复在 `IOS13` 以上版本的设备上的 `isMobile` 判断不准确的问题
-   `art.autoSize` 和 `art.autoHeight` 改为方法的形式调用，即 `art.autoSize()` 和 `art.autoHeight()`
-   添加新的属性 `art.quality`，用于动态更新画质列表
-   修复 `art.aspectRatio` 属性不正确的问题
-   添加 `art.switch` Setter 属性, 功能和 `art.switchUrl` 方法一样

## [5.0.6] - 2023-5-3

-   修复设置面板的样式错误

## [5.0.5] - 2023-5-3

-   弹幕插件添加 `heatmap` 选项，用于是否开启热度图，默认为关闭
-   修复英文字幕换行的样式错误
-   修复设置面板的样式错误
-   移除多余的全局属性
-   移除 `title` 选项，因为目前用处不大
-   移除 `whitelist` 选项，因为目前用处不大

## [5.0.4] - 2023-4-27

-   修复控制器的上拉列表的样式 bug

## [5.0.3] - 2023-4-26

-   修复音量控制器 `event.pageY` 取值错误
-   修改构建配置，`artplayer.legacy.js` 可以兼容到 `IE 11`

## [5.0.2] - 2023-4-24

-   修复控制栏位置的样式兼容问题

## [5.0.1] - 2023-4-24

-   修复网页全屏的样式错误
-   修改内置设置项的文本错误

## [5.0.0] - 2023-4-23

-   重写了音量控制器
-   修复在移动端下，进度拖动的角度不正确的问题
-   重写了 `mini` 模式，现在这个模式下，视频会脱离原来的容器
-   全部组件（层，控制器，右键菜单，设置面板）支持动态删除和动态更新
-   字幕选项添加了 `onVttLoad` 方法，用于在字幕输出前修改 `vtt` 文本
-   重写了全部样式，添加了许多 `css` 变量
-   添加 `cssVar` 选项，用于初始化 `css` 变量
-   添加 `cssVar` 方法，用于设置和获取 `css` 变量
-   插件 `artplayer-plugin-hls-quality` 添加 `getResolution` 函数选项，用于获取从 `level` 中分辨率的文本
-   新增 `artplayer-plugin-dash-quality` 插件，用于添加 `Dash` 画质列表到播放器
-   修复 `lock` 和 `loop` 事件失效问题
-   添加俄语 `ru` 和印度尼西亚 `id` 语言
-   更新 `artplayer-plugin-control`，用于兼容`artplayer@5.0.0`
-   更新 `artplayer-plugin-dash-quality`，用于兼容`artplayer@5.0.0`
-   更新 `artplayer-plugin-hls-quality`，用于兼容`artplayer@5.0.0`
-   更新 `artplayer-plugin-danmuku`，用于兼容`artplayer@5.0.0`

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
-   添加 `es` 语言

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
