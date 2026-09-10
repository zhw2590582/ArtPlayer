# PKG-CHAPTER-04：公开类型与新旧模块消费闭环

## 改动

chapter 公开 Chapters/Option/Result 类型，保留可选工厂、必填同步 update 和旧声明文件。
核心与 chapter 增加 .d.cts/.d.mts 桥接，按 import/require 条件选择声明，所有 runtime
目标仍是原文件；legacy 对应真实 CommonJS 导出，旧 TS 解析使用 typesVersions 回退。
桥接引用同一份 API 声明，不复制 Artplayer 类或要求旧用户升级编译器。

核心类型的最小配套修正是试点消费所需的构造器/语言入口，不是核心运行时重构。
language 值改用格式对应的默认导出，旧编译器回退文件从 I18n['en'] 推导现有字典值类型，
去掉原错误抑制和模块 augmentation。编辑器语言声明由 build:ts 生成独立全局文件并加入
libUris，核心/chapter 编辑器声明也重新生成；没有手写产物。

详见 [chapter 架构](../../packages/artplayer-plugin-chapter/ARCHITECTURE.md) 和
[核心声明说明](../../packages/artplayer/types/README.md)。采用的格式规则参考
[TypeScript 官方模块说明](https://www.typescriptlang.org/docs/handbook/modules/reference.html)。

## 验证

- TS 5.9.3 的 Node10 CommonJS、NodeNext CJS/ESM、Bundler ESM，以及 TS 4.3.5 Node10
  全部通过：31 个消费场景，包含普通 API、章节参数/命名类型、语言值、legacy 和直接 CJS require。
- 新增反例验证 Result 字面量 name、必填 update、数字时间、语言值类型和非法字段仍拒绝；
  不是使用 any、skipLibCheck 或宽泛索引消除错误。
- 实际 tarball 安装后的 23 项运行时与五组严格类型通过，已知诊断为 0；
  `yarn test:package:release` 正常退出。历史 11 条候选已知错误全部移除，原发布基线保留。
- 安装产物三浏览器 54 项通过、无跳过/重试；最终重新打包后的 runtime 文件 SHA 与浏览器
  实际加载的文件相同。报告、声明/入口指纹见 [执行记录](../baselines/chapter-types-validation.json)。
- `yarn ci:check` 62 项 Node/基线测试通过；新旧消费者正反例、严格源类型和 lint 通过。
  `yarn build:ts` 成功，只有 core/chapter、语言声明和其加载清单发生实际生成内容变化。

补上类型回退后，旧 BASE-05 消费器检测到向上解析到 workspace 的错误：其临时目录原来在仓库
内。现在使用仓库外 OS 临时目录并验证清理边界，隔离断言保持不变；冻结发布结果逐项对照通过。
这证明旧版历史失败没有被新声明覆盖，未重新生成或放宽基线。

## 边界与接续

关闭 BASE-TYPE-01 和 BASE-TYPE-03；BASE-TYPE-04 等其余核心声明/运行时差异仍开放。
未改核心运行时代码、依赖或版本；没有推送/发布。严格打包通过不代表完成全部插件、完整编辑器、
真机/SDK 和远端 CI 验收。下一项按依赖推进试点汇总及 ENG-10，再进入核心源码拆分。
回退本任务独立提交即可恢复声明、manifest、测试与生成编辑器内容；chapter TS 运行时提交独立保留。
