# PKG-AUTO-THUMB-03 任务与资源所有权检查点（doing）

生产入口拆为index/options/session/extraction四个JS模块。入口只负责公开异步注册、
活options和核心事件；session拥有当前任务及生成的URL，extraction只接收受保护的job
和本次配置。新增包内ARCHITECTURE.md，严格TS及公开声明留在04，不冒充已迁移。

旧任务在restart/重复metadata/destroy前失效，metadata/seek/Blob迟到回调不能再写入。
先draw有效帧再串行编码，移除空白初始encode和并发回调倒退，重复Blob回调只消费一次。
完成后也pause/清空src/load释放decoder，最终URL保留到下一张可用图或destroy；失败保留
此前可用预览，只收回本包URL。核心setter异常、原生media错误、缺context、draw/encode/
null Blob都有失败归属并通过console.warn观察，公开注册Promise保持原时序和Result形状。

注册失败回滚监听器并保持原拒绝值；清理中pause抛错也继续后续清理。新任务先安装
再释放旧任务，覆盖清理/参数getter/媒体getter/URL创建/宿主setter中的同步重入。
保留十列/帧起点/比例高度/活参数/defaults/忽略height，及旧JS可转换数字字符串和
小数number的ceil抽帧行为；非有限和无效画布维度提前终止。unsigned整数界限不代表
完整内存预算，后续仍需审查；不会靠一个粗略限制偷偷改变可用的大图调用。

24项候选测试在冻结旧版2通过/22失败，源码/main/legacy各24通过；两个通过项保留旧URL
短路及metadata时长快照，22项失败对应已修复生命周期问题。原生验证针对
真实HTTP/video/seek/JPEG回调的destroy/restart/complete资源所有权，明确不是像素修复
或最终核心组合。WebKit分离decoder的像素风险保持open，本任务继续doing；剩余03需
完善隐藏渲染/精确帧时间/资源预算与进一步边界，再进入04。

正常包构建再生三份dist和docs/compiled副本，没有手改产物。根test:auto-thumbnail及
test:unit接入24项候选回归，没有新依赖或版本升级。生产源码改变后的每份浏览器
报告独立保存；此前历史像素报告不拿来充当候选像素证据。

见[验证](../baselines/auto-thumbnail-lifecycle-checkpoint.json)与包内维护地图。
本地检查点提交可单独回退源码/测试/文档；若撤回实现，重新运行正常包构建。
不推送、不发布；不将本检查点提交计为完成整个03任务。

最终完整CI1790项（1544单元+14工程+232基线）、339生产TS通过。最终候选各24项，
旧版2通过/22失败；两项额外兼容回归抓住并修复本次引入的fallback提前读取和duration
快照偏差。源码/main/legacy原生生命周期各9共27项重新通过，无重试/跳过/未处理页面错误；
本检查点不声称像素问题已修复。
