# 构建模块归因

运行 `yarn build artplayer --analyze`，或 `yarn build all --analyze`。正常构建产物与无此参数时一致；分析只写入 refactor/.cache/build-analysis/run-*，latest.json 指向本次目录，不向 dist 或 npm 包加入报告。

每个包/格式的 JSON 保存最终输出的字节数、gzip9 和 SHA-256，以及模块列表、renderedBytes、renderedCodeUnits、originalCodeUnits、保留/移除导出。renderedBytes 对实际模块 code 计算 UTF-8 字节；Rollup 自带长度是其统计时的 UTF-16 代码单元，单独保留而不冒充字节，后续缩进等也会改变 code，二者差值不能仅归因于字符编码。模块数值来自最终压缩前的 Rollup 渲染，不是可以相加的 gzip 贡献；originalCodeUnits 也不是原始 TS 文件大小。真实传输、网络缓存、解析或构造耗时不能由这些数字推导。

scripts/build-analysis.mjs 负责报告；projects.js 解析只对 build 有效的 --analyze；build.js 在已有 banner/global 转换之后挂载报告。正常模式不创建报告目录。refactor/scripts/build.test.mjs 实际构建 TS/JS/Less/SVG/inline worker，并验证分析开关前后三格式字节完全相同、dist 清单不增加文件、报告哈希等于输出哈希。

## CORE-22 首次归因

固定已发布 5.4.0、重构起点 40fcda6a 的工作区源码、当前核心三者分别记录。起点源码使用当前工具链在独立目录重新构建，只用于同工具链归因，不能冒充已发布 tarball。

| 现代核心来源 | 原始字节 | gzip9 |
| --- | ---: | ---: |
| 已发布 5.4.0 | 134037 | 35486 |
| 起点工作区产物 | 134753 | 35735 |
| 起点源码用当前工具链重建 | 134697 | 35703 |
| 当前核心 | 207875 | 58374 |

同工具链对照仍增加 73178 原始字节、22671 gzip 字节；所以主要原因不是工具链切换。Artplayer.STYLE 单独比较只增加 1927 原始字节、277 gzip 字节，不能解释整体增长；独立字符串压缩仅用于诊断，不能从总 gzip 中直接减掉后视作 JS 精确贡献。

按已提交现代产物重新压缩，CORE-23 键盘/焦点为 +6852 gzip 字节，CORE-14 设置树为 +3772，CORE-16 显示模式为 +3223，合计约占起点至当前 gzip 增量的 61%。这些是各次实际提交的净变化，不是每个模块可以独立相加的压缩大小。早期工具函数 TS 迁移的增量为 45 字节，后续增量主要对应行为补齐、资源/竞态修复，不能概括为 TS 语法导致膨胀。

| Rollup 模块组 | 起点渲染字节 | 当前渲染字节 |
| --- | ---: | ---: |
| setting | 17167 | 51289 |
| control | 20634 | 35134 |
| contextmenu | 5841 | 12546 |
| icons | 23394 | 23560 |
| option-validator 单模块 | 4217 | 4217 |
| vendored screenfull 单模块 | 3581 | 3581 |

目录迁移会改变分组，例如 display 从旧 player 中移出，不能只按新目录的正增量计算功能成本。当前最大源码模块是 setting/render.ts，报告中的模块 code 为 11933 UTF-8 字节；Rollup 记录的渲染长度为 11598 代码单元。后续审查应结合它的失败回滚、更新冲突、挂载回调和焦点契约，不能为减小体积删除已有回归所保护的路径。

没有发现 TS、c8、Playwright 或 Vite 运行时进入核心产物。此轮仅完成归因工具和证据，尚未优化生产行为；ENG-PERF-01/02 保持 open，CORE-22 继续审查可避免的开销和构造耗时。不要把解释了来源等同接受了全部成本。

## CORE-22 构造/销毁热点定位

使用固定 Node 和已有 Playwright，运行 `node refactor/scripts/profile-core-layout.mjs`。
它启动自身拥有的 8086 本地测试服务和 headless Chromium，加载当前源码的未压缩构建，
先预热 10 次，再对 60 次构造、真实本地视频 ready/play/首个解码帧及销毁进行 CPU 采样。
产物、manifest、原始 cpuprofile、分组摘要及服务日志保存在 refactor/.cache/core22-profile-*。
脚本在 finally 中关闭浏览器和自身服务，没有使用连接的 Chrome，也没有新依赖或修改正式性能夹具。

只有调用栈位于 constructProfilePlayer / destroyProfilePlayer 内的样本才计入对应分组；
其余样本独立统计。请求采样间隔 100 微秒不表示平台实际达到该分辨率，采样空隙和原生调用
可能计入 JS 调用方。摘要中的耗时是带分析器的诊断数据，不得拿来替代未插桩的新旧配对门槛。

两次修改前采样均把 control/layout.ts 的初始 update 定位为构造热点。它在控件 DOM 创建后
同步读取 offsetHeight，之后还会收到 ResizeObserver 的初始通知。现在原生 observer 路径
使用首次布局通知完成测量，避免在后续构造 DOM 写入前额外强制布局；显式 resize 仍同步，
缺少 ResizeObserver 时仍立即测量。新增浏览器用例先复现一次同步读取，修改后三引擎为零，
并检查首轮渲染的窄屏高度、字幕偏移、fallback 和首次通知前销毁。修改后采样不再在构造栈
出现该 update 热点，这一事实不等于整个播放器已经达到性能发布门槛。

销毁采样主要落在原生 video.load() 和模板 DOM 移除，资源作用域清理占比较低。
保留 reset 的 removeAttribute('src') / load 顺序：不能为了缩短同步计时留下媒体资源，
也不能把清理挪到计时窗口外制造收益。原始计时波动仍须通过正式配对与后续 MOD-03/REVIEW-01 复核。
