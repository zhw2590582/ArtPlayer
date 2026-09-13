# PKG-JASSUB-01 发布契约与来源检查点

开始 JASSUB 包迁移，保留原生产源码、vendor、声明和全部媒体资源。冻结两个实际 npm 包、
十二个成员、九份 Git 文本和本地 worker/WASM/font/ASS/MP4 字节清单。同步建立包内维护
地图和 [契约记录](../baselines/jassub-contract.md)，任务为 doing，不标完成。

## 已发现的实际差异

工厂惰性、注册同步返回真实 instance；传入 video 可覆盖 art.video，options 在注册前
仍可修改。声明错误地要求所有三个资源路径，并将同步 resize/setVideo/destroy 声明为
Promise；resize 的参数顺序也不同。新增 JASSUB-TYPE-01 交给 04，保留公开声明。
两个版本的 CJS 分别为 object.default 和直接函数，新增 EXPORT 风险交给 04/06。
历史 ESM 都只有 default 且工厂创建不启动 worker；真实 npm 包不含 worker/WASM/fonts。

匹配上游 jassub 1.8.8：wrapper 仅格式/eslint-disable 差异，worker JS/default font 精确
字节一致。WASM 与该版本不同，且差异涉及代码与数据 section；两份本地模块均能校验。
1.8.6/1.8.5/2.0.10 的进一步比对未找到相同 WASM。完整版本和组件图仍未知，VENDOR-04
保持 open；未替换二进制、未把近似来源标成精确版本。

12 个字体读取 name 表与 OS/2 标志，保存完整元数据及字节哈希。部分包含 OFL 线索，
部分是不同授权文字或缺失许可字段；没有据此推断来源凭证，VENDOR-05 保持 open。
上游 LICENSE/COPYRIGHT 成员冻结可追溯，但本地 WASM/全部字体 notices 尚未闭环。

## 测试和工具

- `test/jassub.test.js` 对六个真实发布/冻结 UMD 及一个冻结源码实现各测六项：CJS/global
  惰性工厂、同步注册/销毁、SIMD 两分支资源配置、live option/video 覆盖、实际同步方法、
  省略选项默认值，共 42 项。代码运行真实 vendor JS，DOM/Worker/SIMD 是受控替身。
- 初次冻结源码的 global 用例误用了生成 CJS，报 module 未定义。已修正为单独生成
  IIFE；生产源码/真实 UMD 不变，不将测试构造错误当成产品缺陷。
- 六项基线检查覆盖发布与源码完整性、旧声明差异、外置资源清点、实际 ESM、上游逐成员
  校验与部分精确匹配、全部字体元数据指纹；本包 48 项通过。
- 新增 `yarn test:jassub`，root test:unit 显式加入新测试；契约 runner 自动进入 baseline。
  显式 lint 通过。完整 CI 2392 项通过（2031 单元、14 工程、347 基线），严格生产 TS
  仍 353 文件。证据见 [验证记录](../baselines/jassub-contract-validation.json)。
- 字体元数据用 bundled Python 3.12，在缓存隔离安装 fonttools 4.60.1、brotli 1.1.0；
  `jassub-font-metadata.py` 是无网络只读检查器。安装位置/重跑方法见契约文档。
  不修改生产依赖、Yarn 锁或包版本，不构建/手改 dist/docs 产物。

## 未完成项与回退

本轮没有真实 worker/WASM 渲染、字体外观或浏览器测试。WebAssembly.validate 只证明
模块可校验，不证明初始化、消息协议或 ASS 绘制成功。资源失败/重复销毁/切源/seek/
倍率/resize 组合仍待 02 及后续阶段；WASM 和字体来源/通知仍待 01。原始取得过程未知。

这是独立本地检查点，不推送、不发布。回退移除新测试/脚本/基线与维护文档，生产行为
保持原样。多字幕与 VTT 的旧 CommonJS 类型取舍未收到新答复，维持原待决状态。
