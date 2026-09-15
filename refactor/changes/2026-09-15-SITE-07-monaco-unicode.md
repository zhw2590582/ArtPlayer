# SITE-07 Monaco 历史 Unicode 数据与通知

来源 HEAD：`1fed96a9093aaac474e36b5cb4013dc50eef60c0`。本次为 SITE-07 的
独立检查点，任务继续 doing、VENDOR-06 继续 open；没有更改编辑器、worker、
播放器运行字节、公开 API 或根锁文件。

## 已实现

冻结并复验 VS Code `829382514cb1065f5ebb90f436e1c6103e153953` 的 strings.ts、
原 Monaco 0.30.1 两份 source map 及实际交付的 editor.main/workerMain 文件。
三份原生成脚本复现了 RTL 正则、Emoji 正则、imprecise 谓词和全部 5,034 个断字表
整数。正则及整数精确比较，谓词通过 TS token 序列忽略排版和注释，不执行表达式。

| 数据 | 冻结来源 | 版本边界 |
| --- | --- | --- |
| RTL | unicode-utils `5c256860b1e4e54b0375165b8451cf7cdabc953a` | fetch 配方指定 UnicodeData-10.0.0d5，不能写成最终 Unicode 10 |
| Emoji 与 imprecise | `6d37cf4362203bfb5431c560cd8809b2cc3b51c1` | UnicodeData 13.0 与 Emoji 13.1 测试数据共同输入 |
| Grapheme tree | `2068fd0695b2798d8debb3646c860f5d37ba75b2` | 2019 年 GraphemeBreakProperty-13.0.0d4 和同批 emoji-data 快照 |

输入来自原生成项目冻结的 Git 数据；版本依据为对应 fetch 配方和数据文件头，
没有声称直接从今天的 unicode.org 重下了相同历史草案。记录同时保留完整历史
Unicode 数据/软件条款，来源为官方 unicodetools 固定 2021 提交，明确其参考身份。
生成器 package.json 写明 Alex Dima/MIT，但固定目录没有独立 LICENSE；不编造
原生成器的许可证文件或原始版权年份。原 Monaco/Microsoft 通知保留。

## 模块和依赖

- `unicode.ts`：AST 边界、token/regex/tree 比对及原配方输入输出适配。
- `unicode-origins.ts`：来源记录与两份运行资产、完整条款/说明的强制关联。
- `reproduce-unicode.ts`：15 个 Git blob、两个 Monaco 归档、17 个历史工具归档
  的验证、隔离解包及三份原配方执行。新增 `yarn verify:monaco-unicode [--fetch]`。
- `monaco-unicode-provenance.json`：源文件 SHA-256/Git blob、归档 SHA-512/SHA-256、
  原 lock integrity、生成结果及字节不变的交付文件记录。
- 正常通知构建加入 core-unicode 完整条款和说明；合计 90 份 notice 加索引。

历史工具使用原 lock 的 17 包闭包，其中 regexpu 实际解析为 3.3.0；package.json
的 dependencies/devDependencies 范围互相矛盾，不按当前范围重新解析。独立缓存
位于 `.cache/monaco-review/unicode-generator`，不运行安装/生命周期脚本，不改变
根 dependency/yarn.lock，不交付到站点运行环境。读取仅限已验证输入，写入仅捕获
在内存；拒绝未知 import、输入、重复/缺失输出。VM 不是恶意代码安全沙箱。

## 验证

Node 24.21.0、Yarn 1.22.22、现有 TS 5.9.3；34/34 单测通过，包含错误/缺失
声明、格式变化、数据替换、配方越界和遗漏通知的负例。严格 docs-tools 类型、
只读 lint、工具链、联网及离线复验、通知生成/只读检查通过。

Chromium 153.0.8010.12、Firefox 155.0、WebKit 26.6（Windows）共 6/6 通过，
零跳过/重试。加载实际 Monaco 模块检查 RTL、Emoji、断字分类与边界；真实编辑器
创建混合文字模型、插入中文并撤销；移动页实际播放、全部通知的 HTTP 字节保持
一致。具体观察及网络诊断见[机器证据](../baselines/monaco-unicode-validation.json)。
这是所选历史行为的验证，不是完整 Unicode conformance 测试。

实现途中发现并修正了两个复验器问题：原 lock 同时使用 SHA-1/SHA-512，不能
假设全是 SHA-1；Emoji 配方也读取 UnicodeData，不能只登记 emoji-test。另将
谓词比较从保留原换行的 printer 结果改为完整 token 序列，增加换行/注释负例。
这些是工具实现修正，没有修改原数据或放宽生成结果比较。

## 剩余与回退

本批关闭选定 Unicode 数据来源缺口；其他内嵌来源、原 WinJS 改编版本、完整
Monaco core 编译及 SITE-07 其他范围仍未完成，202/266 完成数不变。此检查点
不替代生态包验收、远端 CI、真机证据和三轮发布复盘。

回退时撤销本批验证器、冻结输入、通知绑定与测试，并重新生成 notices；原编辑器
资产始终未改。维护命令与边界见 [Monaco README](../../scripts/site-vendor/monaco/README.md)。
未推送、部署或发布。
