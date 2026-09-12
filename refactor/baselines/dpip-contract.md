# Document PiP 发布契约

来源：dpip-release.json固定实际npm1.0.0、1.0.1、1.0.2、1.1.0四个归档，共21个文件。
SHA512 integrity、归档SHA256、每个成员哈希、manifest入口、发布时点均可重跑核验。
冻结当前Git的src/index.js、style.less、声明、manifest、README、.npmignore和demo
共7个输入；未来迁移不改写这些历史哈希。

**1.0.0只有README、package.json和声明，缺少main/module/legacy指定的三个文件。**
归档没有运行时代码，不能用同版本Git源码冒充已发布实现。验证器固定缺失清单，
现有打包检查必须拒绝此归档。行为矩阵只执行实际1.0.1/1.0.2/1.1.0与冻结工作区；
1.0.0仅作分发缺陷和类型对照。全局契约索引中的发布点不代表每类行为均可运行。

## 正常公开行为

- 工厂运行时options可省略；默认width480、height270、fallbackToVideoPiP=true，
  placeholder为Playing in Document Picture-in-Picture。工厂调用时浅拷贝一次，
  之后修改调用者对象不影响结果；显式width:undefined会覆盖480默认值。
- 注册同步返回name/isSupported/isActive/open/close/toggle。状态为enumerable只读
  getter；isSupported在注册时检测window.documentPictureInPicture.requestWindow，
  之后新增能力不会改变此快照；isActive反映是否保存窗口引用。
- open与close实际返回Promise<void>，toggle返回undefined并内部发起open/close。
  不支持且fallback=true时设置art.pip=true，输出warning；不支持且fallback=false
  会进入open的错误提示路径，而非假装已经打开文档窗口。
- 始终添加document-pip右侧控件，index40、pip图标、PIP Mode提示，点击调用toggle。
  document-pip事件的true/false分别切换Exit PIP Mode/PIP Mode提示。
- 正常open请求窗口尺寸，在原位置添加placeholder，将同一个$player通过adoptNode
  移入新document。复制全局document里的link/style及相关属性，补viewport和基础样式。
  绑定窗口resize/pagehide/unload，添加class，重绑核心全局事件，发document-pip=true，
  await sleep(100)后发resize。正常close先去窗口监听，再恢复原位置、关闭窗口、移除
  class、重绑事件、发false，await sleep(100)后发resize。普通关闭保留控件。
- 包加载时注入固定ID样式，loading文档等待DOMContentLoaded，否则立即插入。
  这些均是受控DOM和异步边界的契约，不能当作真实窗口/用户激活/原生视频PiP验收。

## 声明与导出差异

四版声明一致：options必填、各字段可选，open/close/toggle均写void，状态字段写成
可赋值boolean。运行时省略options、异步open/close和只读getter已由测试确认。
04需要保留已有合法消费者，明确异步能力与历史void/Parameters提取的兼容方案；
不能因为Ads曾获批推导修正就自动改变本包返回类型。

1.0.1/1.0.2的CommonJS是namespace.default，1.1.0是可调用工厂；三份可运行归档
都有独立mjs默认导出和浏览器全局artplayerPluginDocumentPip。04/06须兼容两代访问，
而非用1.0.0缺失runtime作导出成功证据。

registry gitHead关联核心依次为5.3.0、5.3.0、5.3.0-beta.3、5.3.1。这里只冻结
对应Git manifest，不代表相同版本npm核心实现相同，更不声明连续兼容范围。

## 后续实现约束

源码观察到pending requestWindow未单独跟踪、open/close后的sleep没有取消、错误
只写notice而缺少回滚、销毁仅调用close、全局document与实际ownerDocument可能不同。
这些疑点登记为source-observed，由02复现后再03修复；正常流程16项通过不等于
生命周期问题已解决。真实窗口、原生视频/Canvas/Mediabunny、焦点键盘和恢复留05。
