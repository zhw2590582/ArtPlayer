# SITE-07 内嵌 Babel、regenerator 与 tokenizer 精确溯源

修改前 HEAD：199021c8a95c3de2a0bc2d3eaa3d65dc32a438df。继续控制台许可审查，
不修改任何站点运行时、自有 TS 逻辑或锁文件。

## 核实与实现

react-inspector 5.1.1 的官方 ESM source map 包含17个外部源文件。16个 Babel
runtime 成员逐字节匹配7.13.10，regenerator-runtime/runtime.js 匹配0.13.7。
Babel 7.14.8/7.16.3 的两个 iterable helper 不同；7.11.2/7.12.5 的导出及导入
形式也不同。保留错误候选说明，不能仅凭库名复用当前版本的来源结论。

linkifyjs 2.1.9 发布归档的 devDependencies 明确固定 simple-html-tokenizer
到 nfrasser 分支提交04799f4638ec5ed903a4e5aa6e832269fa59be6b。读取该固定提交的
归档，用 Babel standalone6.26.0 / es2015 loose 转换，7个文件与发布归档完全
一致，不归一化空白或导出形式。此编译器只用于来源复现，未替换项目构建工具。

新增 embedded-sources.ts 拆分 map 清点与精确转换验证；reproduce.ts 负责编译器、
归档及许可调度。新增来源记录保存所有成员、映射、输出和许可哈希，并验证发布
清单中 Git 依赖字符串。Git归档的SRI是本地测量值，明确区别于npm提供的SRI。
不据此声称恢复了唯一历史安装锁。

三个完整许可随站点生成，含 Yehuda Katz and contributors 署名。console当前有
38份许可文件，全站56份，加总索引57个输出。已有副本的许可文本不改写。
清单保护、缺失许可测试及公共索引浏览器断言同步扩展。

## 验证与限制

- Node24.21.0，Yarn1.22.22策略不变，无依赖安装/锁修改。
- 单元22/22：新增漏列外部源、重复映射、错误版本内容、缺正文、编译输出字节
  变化/重复目标等反例；新增三组件的防遗漏检查。
- docs-tools严格TS与相关lint通过；首次lint发现顶层函数写法，已修复。
- 离线及全39归档联网复现通过：100Parcel模块、加载器及包边、2内嵌许可、17
  map成员、7tokenizer转换精确匹配。联网同时重新核对固定Git归档及上游补充许可。
- 新生成文件的只读校验通过；本地三浏览器实际交付结果见
  [验证记录](../baselines/console-embedded-validation.json)。测试逐字节比较56份许可，
  同时运行移动日志、原生播放和销毁；外部HTTPS隔离，不声称手机或远端发布验证。
  Chromium记录一次pattern.mp4的ERR_ABORTED；播放和销毁断言通过，未处理页面
  错误及console error均为空。诊断未包含取消时间，不推定具体取消时刻；许可
  请求均成功并完成字节比较。

源记录见[embedded sources](../baselines/console-embedded-sources.json)。剩余审查
为replicator、Emotion stylis/hash/cache及Component的Stack Overflow引用，继续
记在console-embedded-notices.json。VENDOR-08 open、SITE-07 doing、199/265不变。
其他Monaco/字体/媒体范围仍未关闭。本批不意味着发布许可审查已全部完成。

回退删除本批三许可及来源验证接入，恢复35份console清单；不影响已修复运行时。
按SITE-07检查点独立本地提交，没有推送、部署或发布。
