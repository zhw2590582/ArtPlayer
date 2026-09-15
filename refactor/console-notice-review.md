# 控制台来源与许可分发审查

审查基点：4bef084328877d30a2abf6f71745831edb1e1c1e。责任任务 SITE-07，风险
VENDOR-08。以下结论仅覆盖本地候选 console.js 及其站点 notice，不代表 npm
发布、整个站点或其余第三方资产已经验收。

## 来源范围

冻结旧产物包含 102 个 Parcel 模块。两个人工维护的入口/视图模块已迁入 TS；
100 个保留模块分别对应 console-feed 的 32 个、CommonJS 组的 41 个、ESM 组的
27 个。固定归档与转换配方能重现全部函数体、依赖边及 Parcel 加载器。来源
记录中的早期 pending/数量是各批历史快照，当前汇总结论以本文件为准。

| 材料 | 当前证据与分发处置 |
| --- | --- |
| 32 个运行包与 Parcel | console-feed/commonjs/esm 三组固定记录；根许可及完整作者文字均交付。styled-components 的 npm 缺失 LICENSE 使用匹配固定 Git commit 补齐 |
| Chromium string-utils | console-feed 内完整 BSD 头，保留 Chromium 作者、条件和免责声明 |
| styled-components rule-sheet | source map 中完整 Sultan Tarimo MIT 头，独立交付 |
| react-inspector 内嵌模块 | source map 中 17 个外部成员分别精确对应 Babel runtime 7.13.10 和 regenerator-runtime 0.13.7，完整许可交付 |
| linkifyjs tokenizer | 发布 manifest 固定 Git 依赖；7 文件经固定 Babel 转换精确匹配，Yehuda Katz 原许可交付 |
| 修改版 replicator | 固定 console-feed TS 源码经 TS 4.1.2 重现运行代码；保留 Ivan Nikulin 原始许可，不冒充未修改 npm replicator |
| Emotion Stylis/rule-sheet | 固定 tag 的源码与 npm 匹配，记录原来对 Stylis 3.5.4 的修改配方，保留 Sultan Tarimo 署名 |
| Emotion MurmurHash | 显式引用的 Gary Court README/MIT 及 Austin Appleby public-domain 说明原文均交付 |
| customStringify | 精确对应 Stack Overflow 第 5 次修订；CC BY-SA 4.0 全文、来源、作者、原片段及编译改动说明交付，脚本末尾有署名链接 |
| shallowequal | 发布 README 引用 react-pure-render；固定原始源码与 Dan Abramov MIT 许可，继续保留 Alberto Leal 当前许可，明确是修改实现 |

复核保留源码中的来源/版权注释。MDN console、ECMAScript 标准、V8 bug 链接、
benchmark 链接及 URI 格式说明属于行为文档引用；没有仅凭 URL 出现就将网页
添加为运行依赖或宣称复制了其实现。已发现的复制来源及 source map 外部成员
逐项在上表处理，没有剩余已识别但未处置的组件署名缺口。

## 混合许可边界

MIT 和 BSD 的完整许可、作者、条件与免责声明随站点交付。哈希算法中的原文
public-domain 声明保持原样；不替作者扩大授权范围。

customStringify 继续按 CC BY-SA 4.0 交付，独立列出原作者、来源和修改，保留
原始片段；不以 console-feed 的 MIT 覆盖它。编译和压缩未改变该函数算法。
[CC BY-SA 4.0 第 2(a)(4) 节](https://creativecommons.org/licenses/by-sa/4.0/legalcode.en#s2a4)
允许必要的技术格式修改；第 3 节规定署名及改编分享条件。
[CC 官方 FAQ](https://creativecommons.org/faq/#if-i-create-a-collection-that-includes-a-work-offered-under-a-cc-license-which-licenses-may-i-choose-for-the-collection)
说明合集不改变所含原材料的许可。结合当前可独立辨识且算法未修改的函数，
本项目采用逐组件许可的分发方式；这是针对当前产物结构的工程判断，不是将
整个程序重新许可为 MIT，也不保证未来任意融合或修改仍适用同一结论。以后
改变该函数、来源、算法或打包边界时必须重新审查，不能沿用本次结论。

## 防止后续漂移

`scripts/site-vendor/console/notices.ts` 从固定来源记录读取许可身份，核对所有
44 个组件与 46 份上游材料的关联；另有一份本项目编写的 react-pure-render
改动说明，共 47 份控制台输出。此校验接入 build/check:site-notices，在写入
之前执行。原有校验继续核对源文件/候选哈希、组件清单和实际文件集合。

新增反例证明：仅保留文件数量、内容和组件名仍可能把 BSD 包错误标到 MIT；
旧通用生成器能接受这种错误关联，新关联校验必须拒绝。错误的归档来源链接
同样被拒绝。独立的 reproduction 命令负责重新核实实际归档与上游内容，
普通构建不联网、不运行历史第三方运行库，也不重跑旧在线 Closure 服务。

## 结论与限制

VENDOR-08 按 `accepted-with-scope` 关闭当前资产的来源与署名缺口：固定源码、
完整已识别组件许可、分发和兼容证据具备。保留的限制是原作者完整安装锁、
唯一使用版本和完整原始构建环境没有恢复；当前记录证明可复现的来源内容和
转换配方。不得将“100 个模块精确匹配”写成“原始构建环境已完整恢复”。

当前脚本运行字节未变，复用既有 51 项控制台组合验证（其中 18 项历史基线），
并针对本次生成物重跑 notice 实际交付检查。后续发布复盘仍需按候选内容绑定
证据并重验；本结论不替代三轮全局复盘、真机和远端 CI/CD。SITE-07 继续处理
Monaco、字体及媒体；VENDOR-04/05/06 没有因此关闭。
