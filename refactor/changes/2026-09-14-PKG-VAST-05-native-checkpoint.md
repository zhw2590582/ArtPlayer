# PKG-VAST-05：真实 IMA 桌面验证检查点

任务仍为doing，本次不是完成提交。前置HEAD为e5c73fa62；已批准的VAST运行时和
类型方案保持不变，没有修改生产源码、公开声明、依赖或分发产物。

## 实际交付

- 增加`yarn test:vast-native`，使用已有Playwright、固定Node/Yarn与8084隔离服务。
  不增加依赖；独立config避免默认PR受控测试隐式依赖外部SDK，单worker、零重试。
- `vast.native.js`用实际npm1.0.0完整bundle和候选两种模式，在npm核心5.1.7、
  npm5.4.0、候选5.4.1上执行广告插播。历史bundle先校验归档，候选使用正常构建配置。
  断言主片暂停、真实广告首帧/时间推进、完成/恢复事件、主片续播及容器移除。
- `vast-recovery.native.js`让真实IMA处理空VAST响应，核验303错误后的主片恢复，
  显式销毁/重建广告会话，第二次广告实际解码后核心销毁，检查容器与终止状态。
- XML只控制测试输入和本地媒体/跟踪图片；没有替换SDK、广告事件或video。
  包架构、测试维护说明、环境矩阵、任务与风险台账同步。

## 终止进程后的结果

完整摘要、原报告SHA256、测试/源码/媒体指纹和逐例结果见
[vast-native-validation.json](../baselines/vast-native-validation.json)。Windows上实测
Chromium153.0.8010.12、Firefox155.0、WebKit26.6，远端IMA均观测为3.789.0。

| 批次 | 结果 | 边界 |
| --- | --- | --- |
| Chromium候选两模式前贴片探针 | 2通过 | 真实广告解码/完成，主片从起点播放 |
| 首轮插播27组合 | 23通过、4失败 | 1项首帧断言竞态，3项SDK9000超时；完整保留 |
| 错误恢复/重建/活动广告销毁 | 6通过 | 三引擎、候选核心、两模式；真实303及第二段广告解码 |
| 修正夹具后27组合 | 22通过、5失败 | Chromium9/9、Firefox5/9、WebKit8/9；不是全绿 |

最终5项失败：Firefox旧插件+5.1.7和5.4.0核心在7秒注册等待内未就绪；其中一项
在失败后采集状态时才ready，不能倒算通过。Firefox候选默认+5.4.0核心收到SDK9000
后广告仍迟到播放；旧插件+候选核心收到9000但未在等待窗口开始广告。WebKit旧插件+
候选核心已收到AdStarted，却未在首帧等待中取得有尺寸且时间推进的广告video。
这些失败需要后续分层取证，不能笼统归为VPN，也不能凭其他轮通过把它们关闭。

初次插播夹具直接new Artplayer却点击了只在createPlayer中绑定的按钮，2项失败后
中断（exit1），报告/日志保留在`vast05-native-unwired-play-report`和
`vast05-native-matrix-first.log`。修正为使用现有createPlayer。首帧检查改为等待
实际尺寸和时间推进，未提高7秒断言预算；主片改用90秒本地样本，使冷加载和插播
不会混入短片自然结束路径。未改变SDK自身5秒/10秒预算，也没有新增重试或skip。
一次进度消息误用未完整读取的尾部计数报24/27，已当场更正；本记录使用最终JSON。

## 内置浏览器的真实示例

Chrome库存连接失败后使用已授权iab fallback，打开8082编译VAST示例并点击播放。
UA报告Chrome152.0.0.0，Browser.getVersion不受此接口支持，不能捏造更精确版本。
主片画面实际解码640宽、播放至29.745651秒；页面插件注册且IMA3.789.0已加载。
Network证据中`https://imasdk.googleapis.com/js/sdkloader/ima3.js`返回200，
`http://imasdk.googleapis.com/js/core/bridge3.789.0_en.html`文档请求被
`net::ERR_BLOCKED_BY_CLIENT`拦截，请求/失败ID匹配。因此原线上标签的广告播放
不计通过。事件缓冲报告truncated，不能宣称捕获全部请求或据此确认VPN根因。
没有禁用保护、修改用户网络设置或使用VAST VPN例外；测试页暂停后关闭。

## 剩余门槛与回退

专项只读lint、plan生成/检查、risk-register生成/检查通过，风险台账和浏览器验证
runner的6项工程测试通过。严格工具链检查通过Node24.21.0/Yarn1.22.22及22个
workspace；首次直接node调用被正确拒绝（缺Yarn调用上下文），改用固定Yarn
入口验证通过。git diff --check通过；生产源码、dist、docs编译副本及锁文件无差异。

SDK-07和VAST-LIFE-01保持open；05保持doing，06尚待完整分发。下一步针对实际
超时、迟到广告和WebKit旧插件首帧问题取证，补playUrl/skip与物理iOS/Android
生命周期验证。远端CI、版本与三轮发布复盘是独立门槛。桌面WebKit不代替Apple真机。

本次仅新增可重跑验证与记录，可单独回退本检查点；前两个已批准兼容性提交不受影响。
未push、未发布npm。提交后继续运行每任务提交审计；不把该检查点算为新增完成任务。
