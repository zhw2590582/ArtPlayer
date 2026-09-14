# 逐包回退清单

由 `node refactor/scripts/rollback-inventory.mjs --write` 生成；`--check` 校验同步并复核冻结 tarball 完整性。

本表核对 20 份完整历史 archive 的 SHA-512/SHA-256 和 manifest。它不表示当前 registry 可用，
也不表示全部包的实际回退已验收。机器清单同时保存旧/新 dependencies、peerDependencies 与精确 integrity。

| 当前包 | 目标版本 | 恢复版本/对象 | 旧包运行依赖 | 恢复状态 |
| --- | --- | --- | --- | --- |
| artplayer | 6.0.0 | artplayer@5.4.0 | option-validator@^2.0.6 | archive-verified-batch-rehearsal-required |
| artplayer-plugin-ads | 3.0.0 | artplayer-plugin-ads@1.0.6 | 无声明 | archive-verified-batch-rehearsal-required |
| artplayer-plugin-ambilight | 2.0.0 | artplayer-plugin-ambilight@1.1.0 | 无声明 | archive-verified-batch-rehearsal-required |
| artplayer-plugin-asr | 3.0.0 | artplayer-plugin-asr@2.1.0 | 无声明 | archive-verified-batch-rehearsal-required |
| artplayer-plugin-audio-track | 2.0.0 | artplayer-plugin-audio-track@1.1.0 | 无声明 | archive-verified-batch-rehearsal-required |
| artplayer-plugin-auto-thumbnail | 2.0.0 | artplayer-plugin-auto-thumbnail@1.1.0 | 无声明 | archive-verified-batch-rehearsal-required |
| artplayer-plugin-chapter | 2.0.0 | artplayer-plugin-chapter@1.1.0 | 无声明 | archive-verified-batch-rehearsal-required |
| artplayer-plugin-chromecast | 2.0.0 | artplayer-plugin-chromecast@1.1.0 | 无声明 | archive-verified-batch-rehearsal-required |
| artplayer-plugin-danmuku | 6.0.0 | artplayer-plugin-danmuku@5.3.0 | 无声明 | archive-verified-batch-rehearsal-required |
| artplayer-plugin-danmuku-mask | 2.0.0 | artplayer-plugin-danmuku-mask@1.1.0 | @mediapipe/selfie_segmentation@^0.1.1675465747, @tensorflow-models/body-segmentation@^1.0.2, @tensorflow/tfjs-backend-cpu@^4.21.0, @tensorflow/tfjs-backend-webgl@^4.21.0, @tensorflow/tfjs-converter@^4.21.0, @tensorflow/tfjs-core@^4.21.0 | archive-verified-batch-rehearsal-required |
| artplayer-plugin-dash-control | 2.0.0 | artplayer-plugin-dash-control@1.1.0 | 无声明 | archive-verified-batch-rehearsal-required |
| artplayer-plugin-document-pip | 2.0.0 | artplayer-plugin-document-pip@1.1.0 | 无声明 | archive-verified-batch-rehearsal-required |
| artplayer-plugin-hls-control | 2.0.0 | artplayer-plugin-hls-control@1.1.0 | 无声明 | archive-verified-batch-rehearsal-required |
| artplayer-plugin-jassub | 2.0.0 | artplayer-plugin-jassub@1.1.0 | 无声明 | archive-verified-batch-rehearsal-required |
| artplayer-plugin-multiple-subtitles | 2.0.0 | artplayer-plugin-multiple-subtitles@1.2.0 | 无声明 | archive-verified-batch-rehearsal-required |
| artplayer-plugin-vast | 2.0.0 | artplayer-plugin-vast@1.0.0 | @glomex/vast-ima-player@^1.21.0 | archive-verified-batch-rehearsal-required |
| artplayer-plugin-vtt-thumbnail | 2.0.0 | artplayer-plugin-vtt-thumbnail@1.1.0 | 无声明 | archive-verified-batch-rehearsal-required |
| artplayer-proxy-canvas | 2.0.0 | artplayer-proxy-canvas@1.1.0 | 无声明 | archive-verified-batch-rehearsal-required |
| artplayer-proxy-mediabunny | 2.0.0 | artplayer-proxy-mediabunny@1.2.0 | mediabunny@^1.43.1 | archive-verified-batch-rehearsal-required |
| artplayer-tool-iframe | 2.0.0 | artplayer-plugin-iframe@1.0.0 | 无声明 | archive-verified-batch-rehearsal-required |
| artplayer-tool-thumbnail | 5.0.0 | 完整旧产物尚缺 | 见原有门槛 | complete-rollback-artifact-required |
| artplayer-vitepress | 2.0.0 | 已验证 Pages 产物 | 见原有门槛 | local-restore-verified-remote-gate-open |

每包优先恢复升级前已验证的应用代码、package.json 和 yarn.lock，再执行 `yarn install --frozen-lockfile`；
离线恢复还需保存所需 tarball/依赖缓存。单独把版本改回去并重新解析依赖，不能替代已测试锁文件。
外部播放器 SDK、worker/WASM、远端媒体和平台能力也要恢复对应配置，npm 依赖表不覆盖它们。

iframe 必须同步恢复旧包名、CommonJS `.default`、helper 路径和应用代码；不将 npm alias 当作兼容门面。
Thumbnail 完整原包缺失以及站点部署恢复仍是发布门槛。正式每批重新绑定候选和回退内容，不能直接复用早期演练结果。

来源：[机器清单](baselines/rollback-inventory.json)、[维护入口](rollback-rehearsal.md)、[发布台账](release-ledger.md)。
