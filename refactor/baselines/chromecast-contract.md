# Chromecast 历史契约

以 [真实发布归档](chromecast-release.json) 为准。1.0.0 和1.1.0 是捕获时 registry 的
全部稳定版；没有把工作区版本或 bundle banner 当作发布版本。1.0.0 的 banner 写
2.0.0，实际 tarball manifest 是1.0.0。两版 registry gitHead 对应插件 manifest 又
分别为2.0.0/1.0.2；逐成员差异独立冻结，来源核心5.1.2/5.3.1仅是提交关联。

## 分发与行为

| 项目 | 1.0.0 | 1.1.0 / 冻结工作区 |
| --- | --- | --- |
| 入口 | main/legacy/types；没有 module/exports | main/module/legacy/types/exports |
| CJS | 对象.default | 直接工厂 |
| 浏览器全局 | artplayerPluginChromecast | 同名工厂 |
| 工厂参数 | 必传 option，字段可选 | 相同；新增未声明的回调能力 |
| SDK加载 | 工厂覆盖availability回调，注册时加载 | 点击时初始化；注册不请求SDK |
| 注册 | async，SDK脚本onload后添加控件 | async，立即添加控件 |
| 注册结果 | name | name/getCastState/isCasting |
| 声明结果 | 同步、仅name | 仍错误声明同步、仅name |
| 点击 | void，查询当前SDK会话 | async，使用闭包保存的会话 |
| MIME/URL | live读取option或art.option.url | 相同 |
| 状态/错误回调 | 不执行新版回调 | onStateChange/onCastAvailable/onCastStart/onError |

选择1.1.0的懒加载作为候选正常行为，历史1.0.0 eager加载单独保留；不是要求恢复
旧版的提前网络访问。旧JS有效的CommonJS default与直接形式都属于后续兼容检查。
回调以属性方法调用，this为原option；自定义icon保留html包装和两个class。工厂不应
机械快照url/sdk/mimeType或回调。控件name为chromecast、position为right、tooltip为Chromecast。

getCastState实际返回原始SessionState，初始null；isCasting依据session是否为null，
不是接收端是否正在播放。状态回调则使用disconnected/connecting/connected/disconnecting。
MIME包含mp4/webm/ogg/ogv/mp3/wav/flv/mov/avi/wmv/mpd/m3u8及application/octet-stream
回退；查询/fragment去除与大小写处理保留。这张映射不证明Cast设备支持对应codec。

## SDK 与资源范围

SDK默认URL仍是gstatic的可变/v1入口，sdk允许覆盖。官方requestSession完成值并非
CastSession，应取得getCurrentSession；旧1.1.0实现存在相应错误。其他SDK初始状态、
并发、Promise和销毁缺陷由02冻结，03修复。依据：
[CastContext](https://developers.google.com/cast/docs/reference/web_sender/cast.framework.CastContext)、
[集成指南](https://developers.google.com/cast/docs/web_sender/integrate)。

默认SVG内嵌path与cast.svg相同，后者带Font Awesome Pro6.5.1商业许可标记；包的MIT
声明不能作为仓库已具备该资产授权的证据。VENDOR-10保持未决，03优先用自有图形
替换，06核对最终包与bundle；历史冻结文件不改写。SDK-06仍缺真实SDK版本和设备会话。

## 重放

`node refactor/scripts/chromecast-contract.mjs`核验SHA512/SHA256、成员、实际入口、
Git关联和图标来源；`yarn test:chromecast`重放受控公共行为。测试不发起外部网络
SDK加载或Cast会话；不等于真实Chrome、接收设备、媒体网络或发布验证。
