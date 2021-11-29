---
title: 处理单个组件
sidebar_position: 3
---

当我们在`layers`、`contextmenu`、`controls`、`setting`里添加自定义组件时，最好带上一个唯一的 `name` 属性，该属性不但会作为类名添加到 dom 元素里，还可以用于快速定位到组件。

这里有三种方法获取组件的dom元素：组件方法 `mounted`、实例方法 `query`、推荐通过 `name` 直接获取

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
});

art.on('ready', () => {
    art.layers.add({
        name: 'layer1',
        html: 'your-layer',
        mounted: function($layer1) {
            //
        }
    });

    art.contextmenu.add({
        name: 'contextmenu1',
        html: 'your-contextmenu',
        mounted: function($contextmenu1) {
            //
        }
    });

    art.controls.add({
        name: 'control1',
        html: 'your-control',
        position: 'right',
        mounted: function($control1) {
            //
        }
    });

    art.setting.add({
        name: 'setting1',
        html: 'your-setting',
        mounted: function($setting1) {
            //
        }
    });

    // Use the query method to get the DOM element of the component
    var $layer1 = art.query('.art-layer-layer1');
    var $contextmenu1 = art.query('.art-contextmenu-contextmenu1');
    var $control1 = art.query('.art-control-control1');
    var $setting1 = art.query('.art-setting-setting1');

    // Recommended use the name to get the DOM element of the component
    var $layer1 = art.layers['layer1'];
    var $contextmenu1 = art.contextmenu['contextmenu1'];
    var $control1 = art.controls['control1'];
    var $setting1 = art.setting['setting1'];
});
```

:::tip 提示

注意，你不能创建存在相同名字的组件

:::
