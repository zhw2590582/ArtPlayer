# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [4.4.1] - 2022-05-17

### Added
- 添加 art.isInput 属性，当为 true 的时候不自动隐藏控制栏，如弹幕正在输入时
- 添加 art.isLock 属性，在移动端当为 true 的时候不能操作快进、开始和暂停
- 修复弹幕输入框的固定宽度 bug
- 设置面板支持 range 和 onRange 选项
- 添加 isAndroid 和 isIOS 工具函数
- 弹幕库添加 lockTime 选项，可自定义输入框的锁定时间
- 弹幕库添加 maxLength 选项，控制输入最大可输入字数
- 弹幕库添加 minWidth 选项，控制输入框最小宽度
- 弹幕库添加 maxWidth 选项，控制输入框最大宽度
- 弹幕库添加 mount 选项，控制输入框自定义挂载位置
- 弹幕库添加 beforeEmit 选项，控制弹幕发送前的校验
- 弹幕库添加 theme 选项，控制输入框自定义挂载的主题色

## [4.4.0] - 2022-05-15

### Added
- 设置面板支持 switch 和 onSwitch 选项
- 弹幕库插件添加设置面板和弹幕发送
- 弹幕库的选项添加默认模式和默认字号
- 弹幕库字号支持按播放器的百分百
- 修复翻转设置的图标缺失
- 默认播放器获取了焦点后，不会自动隐藏控制栏
- 删除字幕开关按钮，需要自行配置字幕开关