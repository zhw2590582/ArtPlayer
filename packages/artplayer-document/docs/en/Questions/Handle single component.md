---
title: Handle a single component
sidebar_position: 3
---

当我们在`layers`、`contextmenu`、`controls`、`setting`里添加自定义组件时，最好添加一个name属性，用于定位到组件的dom元素

When we add custom components in `layers`, `contextMenu`, `controls`, `setting`, It is best to add a `name` property that is used to position the DOM element to the component.

Here are three ways to get the DOM element of the component: component method `mounted`, instance method `query`, recommended through `name` direct acquisition

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
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
        html: 'your-setting'
        mounted: function($setting1) {
            //
        }
    });

    // Use the query method to get the DOM element of the component
    var $layer1 = art.query('.art-layer-layer1');
    var $contextmenu1 = art.query('.art-contextmenu-contextmenu1');
    var $control1 = art.query('.art-control-control1');
    var $setting1 = art.query('.art-setting-setting1');

    // Use the name to get the DOM element of the component
    var $layer1 = art.layers['layer1'];
    var $contextmenu1 = art.contextmenu['contextmenu1'];
    var $control1 = art.controls['control1'];
    var $setting1 = art.setting['setting1'];
});
```

:::tip 提示

Note that you can't create components with the same name

:::
