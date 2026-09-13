# PKG-CAST-03 Chromecast 模块与生命周期修复

原单文件拆为5个strict TypeScript模块：入口、SDK加载协调、每实例控制器、媒体请求、
内部SDK类型。公开npm声明保持原状，精确公开类型留给04；不会因内部TS迁移静默
修改历史类型。保留异步注册、控件name/位置/tooltip/HTML hooks、live选项与回调this、
原始SessionState getter和旧CommonJS default调用。详细维护边界见
[包内架构](../../packages/artplayer-plugin-chromecast/ARCHITECTURE.md)。

## 已修复行为

- requestSession成功后重新读取getCurrentSession，不再把完成值当session。
- 完整SDK立即复用，同模块多实例共享待加载脚本；保留外部availability回调，失败
  可重试，最后等待者销毁可释放自有脚本。无SDK就绪信号时30秒超时，定时器可释放。
- availability同步安装监听，初始NO_SESSION不吞掉首次请求；请求/媒体期间终态
  和会话替换取消过时结果。重复及同步重入点击共享同一个操作。
- await完整loadMedia链，原始错误只通知一次；DOM点击无人接收Promise时有独立
  拒绝观察，程序调用仍收到原始拒绝。销毁后没有晚到成功提示或新媒体加载。
- 每实例分别维护状态与监听，销毁尝试全部清理，不结束页面共享投屏会话。
- 默认图标换为本项目原创几何SVG，保留自定义icon与外层class。旧商业图形仅保留
  在历史基线，候选源码、三格式dist及docs/compiled均移除该path。

## 真实浏览器反查出的错误

首轮源码浏览器45项中18通过、27失败，原始报告和trace保存在
`refactor/.cache/chromecast03-browser-initial/`，没有删除失败证据。
其中实际Control.add返回undefined，测试替身却返回节点，掩盖了候选图标不变色。
修复改用既有mounted回调捕获本控件，候选替身也改为准确回放mounted并返回undefined。
改测试后、改源码前的红例保留在`chromecast03-mounted-red.log`；修复后35项绿例在
`chromecast03-mounted-green.log`。没有改核心返回值，也没有弱化颜色断言。

WebKit另有测试边界错误：同源Blob URL被误当外网。测试仅放行与测试baseURL精确
同origin的blob，真正外网仍阻断并断言零尝试；没有拦截unhandledrejection来掩盖错误。

## 验证与未完成范围

93项冻结历史行为/故障测试和35项候选测试共128通过；最终main、legacy各35项通过，
并核对真实mjs及可写default身份。正常Yarn构建更新三格式dist与docs/compiled。
共享strict检查覆盖366个生产TS文件；定向lint通过。

源码、最终main、最终legacy各45项真实浏览器测试通过，共135项、零skip。
每组使用真实核心5.3.0、最新已冻结发布核心及候选核心，运行Chromium/Firefox/Windows
WebKit；断言实际DOM点击、控件归属、状态颜色、加载/销毁、失败重试与无未处理错误。
SDK明确为受控替身，本地视频和控件是真实浏览器对象。Windows WebKit不等于Safari
设备支持，以上不证明真实SDK发现设备或接收器播放。

本任务关闭5项已复现Cast实现风险及候选图标来源风险；SDK-06真实HTTPS sender、
接收设备与媒体可达性留给05，公开类型留给04，完整npm分发验收留给06。不同模块副本
不共享内部加载注册表；页面其他Cast应用的接收器配置不由本插件协商。所有这些限制
已写入包内文档，没有静默判作通过。可追溯哈希、日志和范围见
[验证记录](../baselines/chromecast-runtime-validation.json)。独立本地完成提交，不推送或发布。
