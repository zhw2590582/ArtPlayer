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

## 生命周期历史复现（02）

`yarn test:dpip`：48项（四实现×12组），覆盖拒绝/fallback、重复/迟到打开、close/destroy、
延迟resize、激活重入、adoption失败、占位移动、跨文档样式、source节点身份及重复样式。
`yarn test:browser test/browser/dpip.spec.js`：48项，四实现×两实际核心×三引擎×两场景。
真实DOM用于迁移、还原与错误验证；窗口API受控，不能作为原生Document PiP验收。
当前WebKit的640宽读数与320宽fixture不同，精确保留为历史观察，待05查清尺寸和媒体
连续性；测试不会宽泛允许任意尺寸。初次错误与修正原因见[02记录](changes/2026-09-12-PKG-DPIP-02-tests.md)，
验收状态见[02证据](baselines/dpip-behavior-validation.json)。03必须新增候选修复断言。
