# SITE-CONSOLE-01 控制台自有 TS 与生命周期修复

旧控制台为不可维护的 Parcel bundle；两个视图会争夺同一个 console hook，卸载后
滚动仍触碰旧 DOM，Firefox/WebKit 的原生错误消息也会被旧 parser 丢弃。
本任务恢复自有 TS 模块并修复这些已复现行为，保留其余固定第三方运行时。

## 结构与兼容

模块职责、队列与资源所有权见
[维护说明](../../scripts/site-vendor/console/README.md)。build.ts 验证原始 SHA-256，
用既有 esbuild 0.27.7 编译入口和视图，仅替换 Focm/W5CS 函数体并移除失效 map
注释。其他 100 模块、依赖表、Parcel 包装及旧 URL 保留。CSS 字符串与旧版精确
对照。React/ReactDOM 17.0.2、styled-components 5.3.3 继续从原模块注入；根工程
React 类型仅用于检查，不携带 React 19 运行时。TypeScript 5.9.3 严格检查边界。

涉及 API-02/03/05/08/09：consoleLog 仍返回 React 组件，重复挂载复用；实例方法、
状态、对象检查、等级/计数/Clear/悬停滚动及全局加载行为保留。新增可选 unmount
适配器，编辑器 pagehide 统一清理。共享 owner 使 count/time 只解析一次，已卸载
订阅不再收到排队日志。最后卸载恢复原属性描述符，且不覆盖后来安装的外部 wrapper。
错误消息适配保留堆栈且不修改 Error。回调抛错继续对外可见，同时不阻断其他视图。

这属于站点内部修复，没有库入口或包版本变化。VENDOR-08 只更新候选指纹与修改
边界；未知的完整第三方版本/源码与许可保持开放，不以冻结 bundle 宣称来源完整。

## 验证

- 先用正确行为回归验证旧生产脚本：11 失败/1 通过，保留原报告。
- 初次候选组合 57/57；完成编辑器清理后的最终组合 63/63，追加共享状态解析 3/3。
  Chromium 153.0.8010.12、Firefox 155.0、WebKit 26.6，Windows，零重试/跳过。
- 六项单元覆盖原生转发/接收者、共享解析、过期日志、失败回滚、外部 wrapper、
  抛错订阅、错误对象、样式与两个模块以外的字节保护；编辑器和 notice 十项通过。
- 两组严格 TS、生成/check、根 lint 通过；追加测试 scoped lint 通过。
  根 lint 的 ESLint 零错误/警告，Yarn 仍输出已有 Node url.parse 弃用提示。
- CI 配置检查通过；impact 采取保守全生态映射，并继续报告未完成的安装消费缺口。

原始失败、首轮成功、最终输入/逐项结果见
[验证记录](../baselines/site-console01-validation.json)。受控 pagehide 测试不等于
真实物理设备 BFCache；没有宣称全生态测试、远端 CI、部署或 npm 发布完成。

## 工程入口与回退

新增 build:console、check:console、test:site-console，并接入 ci:build、ci:check、
test:node。复用已安装依赖与根 yarn.lock；没有新增依赖或改变 Yarn Classic 1.22.22 /
Node 24.21.0。源码和包内维护说明与状态同次提交。

回退本任务 commit，恢复原控制台、编辑器清理和生成/检查入口，同时恢复风险与
候选指纹；冻结历史不动。不要手工改生成 bundle。下一步继续 SITE-07 的 console
第三方溯源/许可和站点剩余资产，SITE-05 仍需完整站点验收。无推送或发布。
