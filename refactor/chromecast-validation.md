# Chromecast 真实环境验收

实现和受控回归入口见
[包内维护说明](../packages/artplayer-plugin-chromecast/ARCHITECTURE.md)。
本文件补充真实远端 SDK 与接收设备验证，不能以 stub 测试替代物理投屏。

## 当前已有证据

[2026-09-16 Chrome 记录](changes/2026-09-16-PKG-CAST-05-real-sdk.md)使用实际
Chrome 152.0.7977.84 和本地编辑器。现有工作区核心5.4.1与重构核心6.0.0均
实际加载 Google Cast Framework，当前返回 NO_DEVICES_AVAILABLE。记录包含
一次远端502、再次点击成功及重复Run后的SDK重新初始化；它们不是接收端播放。
源码/类型/受控DOM组合和安装证据保留在任务01—04与CI记录中，不重新包装为真机通过。

## 复现加载观察

1. 使用固定 Node/Yarn，并确认本地站点提供的核心/插件来自当前构建。
2. 打开 `http://localhost:8082/?libs=./compiled/artplayer-plugin-chromecast.js&example=chromecast`。
   记录Prod设置、实际核心版本、插件响应哈希与浏览器完整版本。
3. 点击Cast，记录bootstrap及其子脚本状态和实际SDK状态；仅网络200不代表已就绪。
   远端失败保留首次证据，再验证用户重新点击的恢复，不将连续重试当成原本通过。
4. 重复Run后检查一个播放器/控件，再点击确认能重新初始化。不要仅凭图标判断
   会话建立或接收端播放；记录getCurrentSession和接收设备上的实际结果。
5. 恢复测试前的编辑器设置，关闭测试页。不要保存无关页面请求、cookie或账户信息。

## 仍需真实设备的检查

- 在支持的Chrome安全上下文中连接可用Cast设备，分别验证原支持范围核心和
  重构核心。先明确加载的npm/候选版本和文件，不能把5.4.1工作区观察当作完整旧版矩阵。
- 选用接收端可以访问的绝对媒体URL。当前示例的本地 `/assets/sample/video.mp4`
  适合验证页面/SDK加载，不能证明接收设备能访问这台电脑的localhost或相对路径。
  插件不负责改写消费者URL；接收端可达性必须独立确认。
- 用户选择设备后，验证requestSession之后获取真实currentSession，接收端实际
  播放正确视频；验证媒体URL更新、重新载入、取消选择、会话断开及错误通知。
- 多播放器各自更新控件并独立销毁；销毁一个播放器不应擅自结束页面共享会话。
- 保留Chrome/系统/设备型号、媒体来源、SDK响应及对应候选摘要。没有设备的观察
  和能力限制单独标注，不能将isCasting或一个会话对象当作实际播放证据。

这些步骤属于PKG-CAST-05/06和发布前设备验收。正式REVIEW-01/02/03仍等待用户指导。
