# SITE-07 修改版源码与原作者署名

修改前 HEAD：d2a83f8a69c7a5d9a8bf30c9b370e573034f2000。继续控制台内嵌来源
核查；本批不改任何站点运行时、公开API、包版本或锁文件。

## 来源与实现

replicator 属于修改过的1.0.x源码家族，不能称为原样安装某个npm版本。其固定
console-feed提交de41ef2662019c645a652199d9bdbbfc71419f5e中的TS源码，使用
TypeScript4.1.2、ES3/CommonJS/LF生成，与npm3.2.2的运行代码逐字节一致；唯一
排除的是末尾原有inline source map。当前TS5.9.3会改变模板字符串的编译方式，
不能拿它的输出当作历史源码不匹配。原作者Ivan Nikulin的MIT许可从1.0.1保存，
明确这是修改版来源署名，不声称恢复唯一上游基点或原安装锁。

Emotion Stylis0.8.5对应Git tag提交6dd425bd1b8db7ab5144cca81b592639a68af2cb，
src/stylis.min.js与npm归档逐字节一致，package.json明确固定Stylis3.5.4。
上游build.js修改原始Stylis后请求在线Closure服务；保存这一历史配方与源码，
不执行过时服务，也不声称该更早阶段已重新构建。补齐Sultan Tarimo的MIT全文。
cache源码显式链接rule-sheet来源，已有Sultan完整注释继续保留并验证。

Emotion hash的两个显式来源分别为Gary Court的murmurhash-js与Austin Appleby
的MurmurHash2。Gary于2011年提交的README含完整MIT文本；Austin固定提交的CPP
顶部含作者署名及public-domain声明。保存源文件及原样截取声明，不用外层Emotion
许可替代这些作者信息。

attribution.ts负责Git内容/对象身份校验和修改版输出边界，reproduce.ts负责调度。
所有固定Git内容同时校验SHA-256和实际Git blob SHA-1，联网读取的base64响应也
走相同校验。历史TS编译器9,002,076字节，成员读取上限由8提升为16MiB；只在
忽略的复现缓存加载，不安装为项目依赖。新增4份公开notice，console共42份、
全站60份，加总索引61输出；生成器防遗漏保护同步更新。

## 验证与剩余范围

- Node24.21.0，Yarn1.22.22策略不变；24/24单元通过，增加Git对象错误、修改
  内容、错误API编码、缺正文，以及只允许末尾source map差异的反例。
- docs-tools严格TS和相关lint通过；console及notices只读生成校验保持。
- 离线完整复现通过：原100模块/Parcel/包边、17map源/7tokenizer、5个固定Git
  来源、replicator运行代码和Emotion发布源码匹配。联网及三浏览器交付细节见
  [验证记录](../baselines/console-derived-validation.json)。
- 浏览器使用本地真实页面与媒体，逐字节比较60份许可，并验证移动日志、播放及
  销毁。外部HTTPS由夹具隔离，不代表手机、远端CI或发布验收。
  Chromium诊断包含一次pattern.mp4的ERR_ABORTED，媒体播放断言通过；没有
  未处理页面错误或console error。记录未包含请求失败时间，不推断具体取消时刻。

来源台账为[derived attribution](../baselines/console-derived-attribution.json)。
控制台仍需处理Component的Stack Overflow引用与最终内嵌清查，VENDOR-08保留
open；SITE-07及其他Monaco/字体/媒体范围仍未完成，状态为doing，199/265不变。

回退移除本批4个notice及额外来源/复现步骤，恢复38份console清单，不影响此前
控制台修复。独立本地检查点提交，没有推送、部署或发布。
