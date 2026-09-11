# 覆盖率、资源与性能报告

本文由 ENG-08 维护。覆盖率和资源/性能配对链路已通过工程验收，见 [冻结证据](baselines/quality-validation.json)。报告工具通过不等于核心或发布验收通过。

## Node 单元覆盖率

使用固定 Node 24.21.0、Yarn 1.22.22，运行 `yarn test:coverage`。新增开发依赖 c8 12.0.0 仅在仓库测试中使用，不进入发布包的运行时依赖。版本由根 package.json 和 yarn.lock 固定。

执行顺序：真实映射回归测试 → package.json 中同一份 test:unit 用例列表 → Node V8 原始收集 → 源码映射检查与路径归一化 → c8 报告 → 关键文件门槛。正常 test:unit 仍使用原加载路径；覆盖率模式为每个进程生成带 inline source map 的模块，并关闭测试构建的 tree shaking，防止未使用代码从分母消失。此模式不是发布构建配置。

| 文件 | 职责 |
| --- | --- |
| scripts/coverage.mjs | 编排收集、报告和门槛，使用全新的 run-* 目录 |
| scripts/coverage-maps.mjs | 保留原始 V8 JSON；核对映射内源码与本轮源码 SHA-256；在独立目录把 file URL 转为本地路径 |
| scripts/coverage-report.mjs | 枚举真实源码，检查报告文件清单和计数，按有效计数重新计算百分比 |
| scripts/coverage-policy.json | 已纳入的包、明确排除理由及关键模块门槛 |
| test/coverage.test.js | 实际运行 esbuild/Vite 两种加载器；验证未执行分支/未导入文件、空计数、缺失/过期映射和跳过计数不能伪装通过 |

当前纳入 artplayer 与 artplayer-plugin-chapter。224 个运行时文件进入分母；25 个仅类型文件和 1 个第三方 screenfull 文件单独列出，保留内容哈希和排除理由。后续迁移生态包时扩展 packages 与对应风险门槛，不得声称已经覆盖全部 22 个包。

| 关键文件 | 行最低值 | 分支最低值 | 函数最低值 |
| --- | --- | --- | --- |
| lifecycle/scope.ts | 95% | 90% | 95% |
| lifecycle/resources.ts | 95% | 90% | 95% |
| lifecycle/instance.ts | 95% | 90% | 95% |
| source/operation.ts | 90% | 85% | 90% |

以上是原始门槛，未为通过检查降低。关键指标分母为零直接失败。总覆盖率用于显示缺口，不替代功能验证；未执行的浏览器 DOM 路径仍显示为 Node 覆盖率缺口。不能将 Node 和浏览器的用例数相加后声称覆盖率提高。

`refactor/.cache/coverage/latest.json` 指向本次报告目录。run-* 中保存 inventory.json、c8.json、report.json、原始 raw/、归一化 normalized/、测试模块 modules/ 和 HTML/JSON/LCOV 报告。原始收集文件保持不变；report.json 保存归一化前后 SHA-256。失败记录保持 failed，不自动更新冻结基线。

### 映射问题与生命周期补测

首轮报告中，生命周期文件出现 100% 行覆盖率且函数/分支分母为零。原始 V8 包含有效分支，直接转换也有有效分支；c8 在 applyCoverage 阶段按文件路径过滤，而 Node 缓存中的 sources 是 file URL，两者不一致导致有效范围被过滤，默认行计数却保留。先保留原始数据，再将 sources 归一化即可恢复。回归用例同时检查未执行 return 行仍为零，不能只断言报告生成成功。没有修改 node_modules 或绕过 c8 过滤器。

补充了容器竞争与失败回滚、直接 scope 释放、多个清理异常仍释放预约的单元用例。资源适配器重复创建的无状态空 cleanup 合并为一个内部函数；实际注册的释放句柄仍独立。封闭 scope 返回的监听器/定时器/RAF 句柄重复调用不产生晚到回调。此处不是公开方法或导出调整。

### CI

Node CI 新增 Ubuntu/Windows 覆盖率 job，验证固定工具链并运行完整覆盖率命令，失败时也上传报告及原始映射证据。权限仍为 contents:read，未引入第三方覆盖率服务。仓库尚未推送，远端两个系统的执行结果尚待验证；本机 Windows 通过不能冒充 Linux CI 结果。

## 资源与性能验收

沿用 BASE-06：至少三组同环境旧版/候选配对，交替顺序；每种配置一次预热和五次计时样本。构造/就绪/播放 Promise/销毁阈值为 max(25%, 对应绝对值 2/50/10/2 ms)。压缩采用原始字节、gzip 9、Brotli 6，匹配相同格式与入口，增长超过 max(5%, 1024 bytes) 触发审查。

计时和体积触发审查不等于资源泄漏。候选资源检查严格要求销毁后无实例、DOM、proxy 监听器、RAF、剩余定时器和晚到回调，不以旧版 BASE-PERF-01 的残留作为容许值。计时阶段不装资源探针，资源探针清理自身计时器发生在记录之后。物理设备、GPU/浏览器原生内存仍不能靠这些计数证明无泄漏。

先运行 `yarn test:package`，将 ARTPLAYER_BROWSER_ARTIFACTS 设为生成的 browser-artifacts.json，再执行 `yarn test:performance`。单独的 Playwright 配置按单 worker 运行三种引擎，关闭 trace/video，禁止与其他浏览器或重型构建任务同时计时。测试复用冻结 BASE-06 测量体，仅通过适配器修改脚本 URL 和报告提交方式，原始 fixture 不变。加载前检查包源码/声明来源、构建脚本、依赖和分发哈希，旧产物不能代替当前源码。

scripts/performance-artifacts.mjs 管输入和压缩，performance-fixture.mjs 管冻结 fixture 适配，performance-report.mjs 管配对与资源门槛，performance-summary.mjs 输出审查表；test/performance/paired.spec.js 管真实浏览器执行，test/performance-report.test.js 覆盖不完整配对、换环境、假播放、资源残留、过期源码和改动产物等失败。共享的测量验证从原 performance.mjs 提取为函数，旧发布基线仍保留完整来源校验。

报告保存于 refactor/.cache/performance/run-<engine>-*/report.json 和 summary.md；失败或未完成状态保留，Playwright JSON 与附件另存 browser/。Node CI 在安装包浏览器功能测试后顺序运行配对，追加 GitHub 摘要并上传报告。远端 macOS 执行尚未发生，本地 Windows 不替代该项环境验证。

退出零表示测量完整性、配对规则及候选资源检查通过；review-required 明确表示仍有计时或体积审查信号。该信号不自动失败工程报告生成，也绝不作为发布放行：CORE-22/REVIEW-01 必须处理风险台账。不得把报告改为 passed、抬高阈值或覆盖历史基线来隐藏增长。

### 首轮观测与待审查项

新安装包 run-LF1aXT 在三引擎各三组配对、共 54 次候选资源探针中通过严格清理检查。核心现代版 raw 134037 → 207875、gzip9 35486 → 58374、Brotli6 32533 → 53326 字节，核心 legacy/ESM 同样超过审查阈值；chapter 三格式均未超过组合阈值。已登记 ENG-PERF-01，由 CORE-22/REVIEW-01 归因、优化和审查剩余开销。

Firefox 第二组 core/chapter 构造耗时分别增加 3/5 ms，WebKit 第三组 chapter 增加 3 ms，其他组未触发。这些是首轮间歇信号，尚不能确认稳定回归；ENG-PERF-02 要求保留样本并继续配对验证，不将单组当作优化或退化结论。最终结果以本任务后续冻结证据为准。

最终收尾运行仍为三引擎各三组配对、54 次候选资源探针通过。Chromium/Firefox 没有计时信号；WebKit 第一组 core/chapter 构造各增加 3 ms，另两组未触发。体积结果与首轮相同，两项风险均保持 open。源码和测试、覆盖率计数、安装包指纹、配对原始记录、两个格式各 114 项资源/生命周期浏览器结果及验证日志哈希一并写入冻结证据，未覆盖首轮报告。
