# Canvas代理发布与工作区契约

PKG-CANVAS-01；工作区冻结于20f062bc。registry观察为1.0.0/1.1.0，latest为1.1.0；
两份实际tarball各6成员，SHA512、SHA256、所有文件及manifest见canvas-release.json。
1.0.0包含src/index.js，1.1.0不带src、增加真实mjs；测试直接执行两版实际main产物和
Git冻结工作区，不能用现代构建重生成“旧包”。工作区1.1.0未来按REL-09升至2.0.0。

## 入口、属性和事件

- factory(callback)返回同步注册函数；注册依次创建canvas/video/2Dcontext，返回该canvas。
  callback省略时正常；不添加插件name或公开destroy句柄。
- 先收集canvas可枚举方法并绑定canvas，然后仅转发video里可枚举且canvas上不存在的
  属性。转发get/set为enumerable/configurable；函数读取时绑定video，属性值实时读取。
  既有canvas属性、style和方法优先；同名addEventListener仍是canvas方法。
- 通过零延迟setTimeout，按Artplayer.config.events逐项用art.proxy监听内置video；
  原生event对象原样传给art.emit('video:'+type)。这不等于对canvas dispatchEvent。
- loadedmetadata将输出width/height设为视频intrinsic尺寸；resize按容器比例缩放输出，
  用padding居中。autoSize=true时跳过尺寸变更，但resize依旧会绘制。
- play取消旧RAF后立即触发异步draw，await后排下一RAF；pause/destroy只取消已存handle。
- 支持createImageBitmap时await其结果，drawImage至canvas完整输出buffer，close bitmap，
  然后callback(ctx,video)，再emit('artplayerProxyCanvas:draw',ctx,video)。无bitmap能力
  时直接drawImage(video,...)，callback/event顺序相同。错误发artplayerProxyCanvas:error。

上述是实际正常执行与源码事实；错误/竞争/终止行为由02继续复现，不自动作为应永久
保留的缺陷。属性枚举器用受控DOM描述符做断言，未宣称穷尽不同浏览器的全部属性。

## 类型与分发差异

| 维度 | npm1.0.0 | npm1.1.0/工作区 |
| --- | --- | --- |
| CJS | namespace.default | 可调用工厂 |
| ESM | 无独立mjs | mjs默认导出 |
| 类型导出 | export=与全局声明 | export default |
| callback参数声明 | 必填 | 可选 |
| callback形状 | (ctx:CanvasRenderingContext2D,video:HTMLVideoElement)=>void | 同左 |
| Result | HTMLCanvasElement | 同左，未描述转发媒体能力 |

04必须保留1.1.0的可选参数提取（Parameters包含undefined），不能照搬Ambilight的
“必填最后重载”。旧require.default、全局、现代ESM/legacy/声明路径需分别验证。
README仅demo链接；canvas.js示例省略callback并开启多项播放器功能，不构成这些功能
已在每个代理/核心/设备上验收的证明。03改实现，04补类型，05/06再验证实际消费。

## 历史核心关联的限制

1.0.0 registryGitHead对应Git核心5.1.7，1.1.0对应Git5.3.1。冻结的前者index/template
已有proxy配置及替换媒体元素逻辑，但实际npm5.1.7的option声明和此前浏览器证据都
无proxy。版本字符串相同也不能把未发布Git状态当作npm已发布能力；新增断言并固定
两份Git源码哈希防止误认。这里没有声明一个连续支持范围。

前一步Ambilight代理取色使用工作区Canvas源码+实际npm5.4.0/候选核心，另明确记录
npm5.1.7未启用代理；不是这两版npm代理的浏览器矩阵。来源见ambilight-proxy-validation.json。

## 后续风险

源码可见await bitmap完成后仍可能在pause/destroy后排帧、draw抛错可能遗漏bitmap.close、
延迟订阅与art.on缺少主动终止、空context/早期尺寸需要能力边界。01仅记录，02必须
以受控完成顺序和必要真实浏览器复现，再由03修复，不能为通过旧快照保留泄漏。
