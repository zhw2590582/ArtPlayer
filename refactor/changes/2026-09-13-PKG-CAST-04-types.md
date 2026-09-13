# PKG-CAST-04 Chromecast 类型与安装消费者完成

根/legacy保留真实npm 1.1.0的必填Option、同步name结果和完整普通工厂替换关系。
新增/runtime用同一JS实现准确描述异步注册、四个回调、live option的this、原始
string|null状态和isCasting。Node10 export=、NodeNext CJS/ESM均提供八个命名类型，
self.default保持可写。内部选项和controller返回类型引用公共精确类型，减少漂移。

真实1.0.0是export=声明及CJS对象.default，1.1.0是default声明及CJS直接函数。
候选继续支持两种合法JS调用；1.1.0根NodeNext namespace形状及原有直接调用错误
保持，较早import=require调用迁移到/runtime。README和ARCHITECTURE给出具体说明。
这是已确认历史类型规则的应用，没有再次改变最新根签名或取得新的发布授权。

顺手纠正决策编号冲突：Iframe原ADR-025/026不变，历史类型策略改为ADR-027。
中央文档解释旧类型记录中的ADR-025别名，不改写冻结报告或已验证包内容。

验证覆盖两个真实旧归档和候选的17种安装配置。7个候选配置全部正例通过，
各自按行拒绝17个反例；包括TS5.9.3/4.3.5 noInterop。旧1.1.0 NodeNext直接消费
八个诊断的code和line与候选相同；旧1.0.0的export=差异单独保留。实际离线安装、
frozen重装、全部成员字节和CJS/ESM入口身份通过。4项专项测试验证完整工厂替换、
真实历史声明、独立编辑器和运行时导出。编辑器经语义生成，产物与源声明一致。

首轮pack发现内部tsconfig.json混入发布包，已更新.npmignore并重跑；最终tarball
包括完成后的README/ARCHITECTURE，十个文件逐字匹配。没有用源码路径替代安装消费。
正常构建后，dist及docs/compiled的六个文件与b0cfbfe3a逐字节相同。因此本次不重跑
已在PKG-CAST-03完成的135项浏览器用例，不增加新的设备结论。全局366个生产TS文件
strict和既有消费者通过，专属lint通过。一次误用不存在的typecheck:strict命令已
改为仓库实际yarn typecheck并成功；原日志保留，不把失败算作通过。

CAST-TYPE-01关闭。CAST05仍需要真实HTTPS sender、SDK和Cast设备投屏证据；CAST06
的完整分发、演示及发布前审查仍待完成。详见
[机器证据](../baselines/chromecast-types-validation.json)。此任务独立本地提交，无推送、标签或npm发布。
