# PKG-HLS-02：建立 HLS 控制与真实 SDK 基线

新增发布三格式/源码共用契约、发布特有缺陷观察和四组合真实 Hls.js 测试。
测试主机、包读取、浏览器场景和媒体生成分别归属 test/helpers/hls-control.js、既有 load/release
工具、test/browser/hls-control.spec.js 与 scripts/generate-hls-fixture.mjs。
本任务不改生产源码、公开声明和 dist；模块拆分及类型修正由 HLS-03/04 执行。

45 项 Node 通过；浏览器 31 项通过、14 项明确跳过。最初 Windows WebKit 14 个失败经诊断
确认 MSE 缺失，新增能力/失败清理断言，保留 Safari/MSE 未验收风险。不能用最终退出码 0
作为全浏览器或发布放行。见 [测试说明](../hls-validation.md) 与 [冻结证据](../baselines/hls-validation.json)。

真实 Hls.js 1.5.17、双档位/双音轨和无音轨流覆盖播放、画面、手动/Auto、音轨、pause/seek、
失败恢复、切源和销毁；该样本没有复现 id/index 错位。旧版 Auto 标签与空轨道菜单残留有
浏览器证据，过期回调有受控证据。类型/异步/公开行为不以模拟对象替代真实播放。

工具变更：Node 单测加入 Yarn 正式链；SDK 固定归档只供测试，不新增运行时依赖；合法点分
包名支持及非法路径拒绝测试；媒体生成器拒绝覆盖，生成文件有版本/命令/hash。初次 .ts
媒体后缀被 ESLint 当作 TypeScript，已由生成器改成 .mpegts 并重新生成、重新跑浏览器。

验证：专项 lint、45 项 Node、31 通过/14 明确跳过的浏览器，以及完整 ci:check（485 单元、
11 工程、26 基线，共 522 项；249 个生产 TS 文件严格检查）、计划/风险
和 diff 检查。未重复核心全量安装包矩阵。本任务测试源码构建，HLS 安装包验收仍属 06。
回退本提交撤回测试/样本/来源与风险记录；生产播放器不变。下步 HLS-03，独立提交。

CI 仍有既有生成文件 docs/assets/ts/artplayer.d.ts 的 unused eslint-disable warning；没有
手改生成声明来消除它。媒体 .m3u8 固定 LF、.mpegts 标记二进制，避免跨平台 checkout 改字节。
