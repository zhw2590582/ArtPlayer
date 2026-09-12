# Document PiP 验证维护

先读[实际契约](baselines/dpip-contract.md)和dpip-release.json。验证命令：

`node --test refactor/scripts/dpip-contract.test.mjs`

16项覆盖四归档/21成员/7个Git输入、1.0.0缺失入口、声明和实际导出，再对三份可运行
发布和冻结工作区分别测试同步注册/控件/不支持fallback、正常窗口迁移/样式/事件/还原、
option快照/默认值/延迟样式。1.0.0不在行为矩阵中；不能用Git或新版artifact替代它。
本文件对应测试已接入test:baseline。

test/helpers/dpip.js是受控DOM/window边界：验证ownerDocument、节点身份与顺序、
样式属性、订阅和Promise顺序。requestWindow由受控窗口替身返回，不证明真实用户
激活、弹窗、媒体连续播放、原生视频PiP或设备能力。02继续加入pending打开、关闭/
销毁竞争、style与restore错误；03候选修复必须保留旧失败对照，04处理公开类型。

05的Document PiP双代理组合必须使用迁移后的Canvas和Mediabunny；Canvas05的
文档窗口恢复必须使用迁移后的Document PiP，因此任务图分别增加相应04阶段依赖。
这防止旧实现通过后被误当最终组合通过，不减少任何浏览器或设备验收内容。
06再检查完整tarball、8082 document.pip示例、三种产物和回退说明。

证据入口：[01记录](changes/2026-09-12-PKG-DPIP-01-contract.md)、
[01验证](baselines/dpip-contract-validation.json)。正常契约测试通过不关闭源码观察风险。
