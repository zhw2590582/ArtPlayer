# SITE-04 播放、切源与画质契约

起点：`e8b48cbaed8fd0f8a4827ba6490bc86c7cc8b889`。继续实施期文档核对，
SITE-04 保持 doing，不进入正式复盘。

双语属性指南补齐 play/pause/toggle 的返回值、异常和过期副作用；进度、音量、
速率、缓冲比例与只写属性；attr、type、url、自定义适配器、切源取消与位置恢复；
静态 quality 列表的引用、立即选中和异步完成行为。根历史类型继续保留，说明
PlaybackControls 与 runtime 的准确类型用途，不改变运行时、声明或旧示例。

纠正 switchUrl 的旧说明：Promise resolve 不单独证明新地址正在播放。相同/空
地址、替代和销毁也可正常结束，内部恢复播放失败不导致切源失败；公开 play
仍传播拒绝。调用者必须处理错误，并按业务需要检查当前媒体状态。空地址不清除
旧 src，调用方 Blob URL 的撤销责任也不转给播放器。

新增71条映射，累计900/963，剩余63条。以前分组源码哈希不变；去掉新增说明并
恢复 switchUrl 旧提示后，属性指南与前次内容一致，因此旧生命周期、媒体和CSS
分组只更新文档哈希。94个既有 Run Code 片段逐字不变，8份TS代码块通过严格
NodeNext检查；6组双语浏览器页面、36次选定示例转发通过，中文截图目视通过。

Node24.21.0 / Yarn1.22.22：85项回归测试通过，0失败/跳过，1335.4235ms。
VitePress10.72秒、Yarn12.29秒；LLM、inventory、demo检查通过。首次构建因正文
Promise<void>未写成行内代码，被Vue解析为HTML标签而失败，已修正文档并重建，
失败日志保留。页面验证改用DOM完成与实际标题/代码转发断言，不等待广告网络空闲。

现有源码范围浏览器命令：

```sh
yarn test:browser:source playback.spec.js playback-properties.spec.js progress-quality.spec.js --grep 'real playback|real media preserves|invalid time inputs|quality selectors' --workers=1
```

24项全部通过，0跳过/失败/重试，42.5秒：每种浏览器8项，分别对照旧发布版与
当前源码构建。覆盖真实媒体解码像素、暂停时钟、seek、切源、销毁、时间/音量/
速率属性、无效输入和画质恢复。WebKit旧版画质位置丢失按既有用例单独断言，
当前版仍必须恢复正确位置；没有把旧缺陷当作新版本可接受结果。

该运行明确为source范围，不冒充新的安装包消费验收；文档页面引用的核心dist
另与既有候选tarball比对。21库候选build证据仍有效，真机、SDK、长时播放和
其他发布门槛不变。完整绑定见[证据](../baselines/site04-playback.json)。

未推送或发布。回退本提交仅恢复指南、映射和生成内容；接续剩余显示、尺寸、
截图、缩略图及相关属性，不进入用户保留的复盘。
