# PKG-ASR-09 显式捕获归属与可取消重启

原默认 direct-first 在 Firefox 已有外部音频图时仍可第二次绑定。新增可选
`audioInput: { type: 'capture' }`，不猜测浏览器归属，不用 URL 推断 CORS，完全跳过
createMediaElementSource。捕获失败也不回退到直接绑定，不影响原播放图。缺省调用
继续旧路径。新字段放 RuntimeOption，旧根/legacy 类型精确形状与四个命名运行类型
保持；这是公开配置的加法，不改变已有字段、事件或返回对象。

## 生产实现

工厂把策略转为内部 primitive 快照，外部后续修改嵌套描述不会切换模式。AudioGraph
复用 ASR-08 的 recorder -> gain(0) 静音输出，stop/换源释放自己捕获的轨道和上下文，
pause 保留以便恢复，destroy 最终清理。采集不改主媒体属性，不拥有外部播放图。
未知策略在工厂构造时报错；现有媒体不支持捕获则按初始化失败路径释放资源。

子代理复核又复现延迟 Context.close 的旧竞态：restart 等待期间用户 pause/stop，
旧 continuation 仍重启。先红两例后添加 stop 后 epoch 守卫，后来生命周期操作会
取消旧重启，下一次用户 play 仍有效。此修复同样保护自动 fallback。

## 明确边界

捕获 PCM 不跟随 element 的 mute/volume；它既不混入独立 audio-track，也不包含其他
图的音效处理。不得因此把默认路径改成 capture-first。依据见
[媒体捕获语义](https://www.w3.org/TR/mediacapture-fromelement/#html-media-element-media-capture-extensions)。

显式模式对无授权跨源源：Chromium 原生 SecurityError 后释放自己的 Context；Firefox
可返回 live track 但不提供 PCM。两者零直接绑定、媒体属性不变、原时钟继续。随后
同源切换恢复有效 PCM，stop 与 destroy 清理。没有 CORS 绕过、额外下载或代理。
默认模式跨源限制仍见 [Web Audio](https://www.w3.org/TR/webaudio-1.0/#MediaElementAudioSourceNode-security)。
ASR-CORS-01 保持默认限制记录，不以显式模式测试冒充自动修复。物理扬声器未测。

## 验证

见 [最终验证证据](../baselines/asr-explicit-capture-validation.json)。新增候选13项
包括模式选择、失败清理、两种API、静音图、暂停/换源/stop/销毁、嵌套快照和两项
延迟关闭竞态。最初9项策略失败及后来2项竞态失败分开冻结，历史基线不改写。
类型fixture新增6个拒绝用法，安装矩阵的负例数量断言从12同步到18；首次矩阵仅因
这个旧计数断言失败的报告保留，不能写成旧运行已通过。

最终229项定向通过，main/legacy各43项生命周期通过；原生source/main/legacy共106项
通过、53项能力跳过。正常构建、根/分包严格类型、lint和17配置隔离安装通过。
真实外部 owner 用例包含 Firefox 自然执行、零直接绑定、无强制异常；非零采集、
静音ASR输出、stop/restart/换源与独立清理均已验证。Windows WebKit 无WebAudio明确
跳过；ASR-05 的设备、无音轨/其他不支持媒体及ASR-06发行仍待完成。没有推送、
标签或 npm 发布。
