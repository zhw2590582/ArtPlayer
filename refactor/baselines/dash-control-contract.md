# DASH Control 兼容契约

PKG-DASH-01；冻结来源为实际 npm `artplayer-plugin-dash-control@1.1.0` 归档和本分支
e0d47ea7 的文件。SHA-512、SHA-256、6 个归档成员、manifest、源码和 demo 指纹见
[发布基线](dash-control-release.json)。registry gitHead 只保留为 registry 声明，不当成
已证明可重建该 tarball 的源码提交。当前包版本也是 1.1.0，但不等于已发布内容。

## SDK 兼容边界

已发布 README 指向 dash.js 4.5.2，归档源码调用 getBitrateInfoListFor/getQualityFor/
setQualityFor。工作区 README 已写仅支持 5.x，并指向 5.2.1；源码改为 representations
和 setRepresentationForTypeById。因此它们不是只改格式：归一化工厂哈希也不同。
两边 manifest 和声明相同；README、三种构建产物不同。

[官方 4→5 迁移说明](https://dashif.org/dash.js/pages/developers/migration-guides/4-to-5.html)
确认这些旧方法被替换。按本次旧 API 兼容目标，迁移需通过能力适配保留发布版 4.x 调用，
同时保留工作区 5.x 按稳定 ID 选择的修复；不能把现有“仅 5.x”文案当成允许破坏 npm 旧
消费者的授权。也不以适配器存在就声称所有 SDK 小版本可用，05 至少固定 4.5.2/5.2.1
实际浏览器媒体矩阵，并明确其他版本范围。

5.x selector 的 value 是首次查询列表下标，真正选择必须使用保存的 representation ID，
因为 bitrate 过滤后下标可以变化；不能换成 absoluteIndex。[官方手动选择说明](https://dashif.org/dash.js/pages/usage/abr/manual-quality-selection.html)
也说明 ID 与列表索引的区别。既有 5 项 Node 回归保护过滤、手动高亮、排序、Auto 和 ID='auto'。

## 公开行为

| 边界 | 发布版 / 工作区现状 | 迁移要求 |
| --- | --- | --- |
| 工厂 | artplayerPluginDashControl(option = {}) 返回同步安装函数 | 默认调用和函数形状保留 |
| 安装 | 不立即读 DASH；捕获 template.$video，订阅 ready/restart | 保留延迟绑定，不能要求先安装某个新核心能力 |
| 返回 | name='artplayerPluginDashControl'、update() 同步且无返回值 | 不改成 Promise，不新增必传 update 参数 |
| 宿主 | 使用调用方 art.dash，核对 getVideoElement() 与视频相同 | 不创建/销毁调用方 SDK；丢失实例的诊断与兼容性另测 |
| 配置 | quality/audio 各自 control/setting/title/auto/getName，界面默认不开 | 保留原对象调用及 JS 真值默认值 |
| 默认标签 | quality: height+'p'；audio: track.lang 或 track.id；Auto/Quality/Audio | 精确保留，回调接收原 SDK 对象 |
| quality | 按 html 去重、反向原下标排序、尾部 Auto；选手动先关闭 ABR，再选级别 | v4 保持 qualityIndex；v5 保持稳定 ID，不混用两种键 |
| audio | 按 html 去重，value 是原 track 对象，无 Auto 项 | setCurrentTrack 必须收到原对象，不复制 track |
| 选中返回 | 设置 notice，依次 controls.check 和 setting.check，返回 item.html | 已有同步返回、通知格式、check 参数身份保持 |
| 表面 | dash-quality/dash-audio，右侧 control padding 0 10px；setting width=200 | 保留名称、图标、选择器格式和更新入口 |
| 函数引用 | getName 被作为普通局部函数调用，参数为当前 SDK 对象 | 不增加 this 绑定或修改回调输入 |
| SDK 设置 | 仅更新 streaming.abr.autoSwitchBitrate.video；音轨选择不改音频 ABR | 不覆盖其他调用方配置 |

没有独立自有 CSS 或额外媒体/worker/network 资源。audio.svg 与 quality.svg 是设置菜单图标。
插件安装时创建的监听器和 UI 应由插件释放；SDK 实例由调用方 customType 管理。

## 类型与分发

默认导出声明仍要求 option；运行时允许不传。Config.getName 参数只写 object，不能直接
表达示例中的 height/lang；Config/Option/Result 没有可导入命名类型，也没有格式专属桥接。
04 应验证旧编译器和已有参数推断，在兼容入口之外提供准确类型，不直接收紧旧回调。

保留 main/module/types/legacy、exports 的 '.' 与 './legacy' 以及原文件名。归档真实含
README、package.json、三种 JS 和一份 .d.ts。包没有 SDK runtime dependency 或 peer
version 约束，不能因内部适配要求老消费者安装新核心。计划最终版本仍是 2.0.0，尚未升级。

## 已发现的待修复项

- DASH-SDK-01：发布版 4.x 与当前仅 5.x 的差异，02 建立两代 SDK 行为用例，03 做能力适配。
- DASH-LIFE-01：只订阅 ready/restart，没有销毁/过期回调守卫；空列表直接 return，旧 UI 保留。
  源或 SDK 被替换后，保留的选择器回调仍可调用旧 SDK。02 复现，03 整理所有权与移除。
- DASH-STATE-01：当前 qualityId 真值判断可能漏掉 0；音轨只按对象身份匹配，克隆的 currentTrack
  没有选中标志；按标签去重可能隐去实际当前项。用实际 SDK 数据和受控边界分别验证。
- DASH-TYPE-01：默认参数和 getName 类型不准确，旧解析与格式桥接需验证。
- DASH-DEMO-01：示例重复 customType 会累积 destroy 回调，旧/新 SDK 版本的示例入口需一致。

这些多数是源码事实，不把未执行的媒体场景写成已复现缺陷。当前仅完成来源/契约清点，
实际 SDK 4/5 的播放、换轨、换源、生命周期、npm 安装和 8082 demo 属于后续任务。
