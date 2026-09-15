# SITE-07 固定 Stack Overflow 修订与署名

修改前HEAD：3136eb2402f642f25673b322b6c686405d9af9e0。继续控制台来源清查。

## 来源与交付

console-feed3.2.2的customStringify匹配Alexander Mills的回答48254637第5次
修订，UUID为8FD5F52A-B16F-4C66-AB48-830EABB36CC0，日期2018-09-19。固定修订
API明确返回CC BY-SA4.0。最早修订使用Map，最新修订增加了重复引用处理；不能
把它们当作当前内嵌代码来源，也不能按首次发帖日期推断本次修订的许可。
许可规则见[Stack Overflow](https://stackoverflow.com/help/licensing)，原文见
[CC BY-SA4.0](https://creativecommons.org/licenses/by-sa/4.0/legalcode.en)。

保留最小修订响应、原始代码及完整许可，署名同时保留原回答对Rob W及其回答
11616993的感谢。公开ATTRIBUTION.md说明ES3编译/minify的变化，并提供原始
SOURCE.js和LICENSE。按该片段的上游许可交付，不把外层console-feed的MIT当作
全部内嵌材料的许可。最终混合许可分发复盘仍保持开放。

新增stackoverflow.ts检查修订UUID、作者ID、日期、许可、正文及代码哈希；再
使用已固定的TypeScript4.1.2编译，精确匹配归档中唯一customStringify声明。
reproduce.ts同时支持联网核对固定修订与许可全文；不执行回答中的代码。

生成器在console.js末尾添加署名注释，使单独取得脚本时也能看到作者、许可与
材料链接。新旧产物唯一差异为该注释；100个第三方模块、依赖表、Parcel和自有
模块代码都不变。构建测试仍逐字节检查允许边界之外的内容，未扩大运行代码差异。
页面修订链接无法通过web读取，改为已成功取得的固定API链接；不是把cache miss
解释为该回答或修订不存在。

控制台清单现在43组件、45份notice；全站63份notice，加索引共64输出。清单及
缺失项测试同步更新。修正console-modernization.md中过期的“尚需添加候选测试”
表述，当前文件已经同时含历史基线/问题复现和候选修复回归。

风险生成器检出了third-party.json中尚未同步的产物指纹；核对验证记录中的
“旧产物加完整署名注释”字节相等证据后，同步该清单的指纹与许可状态，保留
原来的漂移检测，没有放宽检查。

## 验证与后续

- Node24.21.0，Yarn1.22.22策略不变；单元25/25，严格docs-tools TS、相关lint
  及生成物检查通过。新增错误修订/许可/日期/正文及重复声明反例。
- 完整联网复现通过，包含42归档、固定Git材料、旧100模块和新片段编译匹配。
- 三引擎组合51/51，零重试/跳过；18项为历史共同契约或旧缺陷/对照验证，不能
  计为候选修复。其余覆盖当前控制台、候选生命周期、编辑器和实际许可交付。
  [验证记录](../baselines/console-stackoverflow-validation.json)保留每项范围与诊断。
  每引擎逐字节核对63份许可。外部HTTPS被隔离，仍不是手机或远端发布证据。

最终清查发现shallowequal1.1.0的package/README.md明确将react-pure-render列为
代码来源；其原始署名尚需核对，已加入console-embedded-notices.json。剩余清查
不能因为当前模块均可复现而省略。VENDOR-08 open、SITE-07 doing，199/265不变；
其他Monaco/字体/媒体范围也没有因此完成。

回退移除署名注释、三份新notice及修订验证接入，并恢复清单指纹，不改变运行
逻辑或旧API。本批独立本地提交，未推送、部署或发布。
