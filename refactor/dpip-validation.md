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

## TS实现与候选修复（03）

源码现拆为6个严格TS模块，真实文件地图见包内ARCHITECTURE.md。`yarn test:dpip`同时
执行48项历史与20项候选生命周期测试；`ARTPLAYER_DPIP_BASELINE=1`运行候选用例时，
保留旧源码17失败/3正常通过。正常契约另有16项test:baseline。
`test/browser/dpip-lifecycle.spec.js`为18项候选真实DOM验证；`dpip-helpers.js`共享受控
窗口入口，记录替换前能力，绝不冒充原生Document PiP。`ARTPLAYER_DPIP_ARTIFACT`
选择明确构建文件（不fallback）；最终产物证据与宽矩阵历史证据分开保存。
本阶段保留原生窗口和媒体/代理验收门槛，详见[03记录](changes/2026-09-12-PKG-DPIP-03-lifecycle.md)
及[03证据](baselines/dpip-lifecycle-validation.json)。04继续公开类型/导出/安装消费者。

## 公开类型和真实安装（04）

`node --test refactor/scripts/dpip-types.test.mjs`验证默认Result旧推导、显式AsyncResult、
完整旧工厂形状、四历史声明、编辑器与实际产物。合法旧工厂/initializer和
void方法替换必须继续编译；RuntimeFactory显式提供可选options和精确返回，不改变默认
函数的反向可赋值性。14项非法用法在五个仓库
编译模式及七个安装消费者模式均需被拒绝。
`yarn test:dpip-types-package`在仓库外安装四实际发布和候选，offline/frozen重装并逐文件
校验字节。27模式包含8历史失败：1.0.0现代解析三项2307、1.0.1三项7016、1.0.2和
1.1.0各一项NodeNext ESM七诊断；候选7项全部零诊断。1.0.0的require必须复现缺失运行时，
不能称作可执行版本。详见[04记录](changes/2026-09-12-PKG-DPIP-04-types.md)和
[04证据](baselines/dpip-types-validation.json)。05/06的原生设备、demo和分发门槛保留。
