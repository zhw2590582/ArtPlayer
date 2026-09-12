# PKG-CANVAS-03 TS职责与资源修复

将旧单文件拆成index/adapter/media/geometry/renderer/scheduler六个严格TS模块。
入口独占宿主订阅和回滚；其余模块只接收所需能力。公开callback、实际Canvas返回、
Canvas自有方法优先、媒体属性转发和原始Event继续保留，公开声明/导出消费者留04。
包内ARCHITECTURE.md记录模块地图、事件顺序、状态和维护边界。

绘制只允许一个挂起任务；resize合并新请求并淘汰旧结果，pause/src/load/destroy
使旧帧失效。bitmap始终关闭，包括绘制异常与过期结果；回调销毁不再发draw/排RAF。
延迟订阅可取消，宿主和媒体注册先记清理后执行，初始化错误及重入销毁会回滚。
销毁后暂停/卸载底层video、解除srcObject引用但不停止用户拥有的轨道，释放Canvas
buffer；已捕获媒体方法与setter不再重启工作。暂停seek补绘一帧，不重启连续播放。

真实浏览器修复过程保留失败证据：旧未挂载video在WebKit透明；接入宿主并在播放前
挂载后可绘制。但1×1隐藏尺寸令WebKit媒体尺寸也变为1×1，因此改为原始CSS尺寸，
并增加320×180尺寸和多点颜色断言，避免仅alpha255误判。底层video绝对定位、
opacity0、不可聚焦/点击，不增加可见播放器。

切源或seeking期间未形成可用帧会暂缓绘制。Chromium首次bitmap失败时readyState4、
currentTime0、totalVideoFrames0，独立直接绘制仍透明；WebKit却可能一直上报零帧。
因此不能全局以帧计数阻止绘制，只在bitmap获取阶段的精确首帧InvalidStateError
条件等待后续请求，稳定错误、drawImage错误和用户回调错误仍保持事件语义。

初始14项候选测试在旧源码13失败/1正常通过；随着浏览器发现继续补充回归。最终
测试/构建/浏览器结果和输入哈希见[验证证据](../baselines/canvas-lifecycle-validation.json)。
生命周期和像素风险在最终验证前继续open；设备、公开类型、npm消费者并未以本步代替。

源码复查发现可选调用callback?.会把旧JS传入false/0/空串的无回调用法改成TypeError。
新增真实三历史实现对照后在初稿复现，恢复旧truthy guard；声明依然只承诺可选函数，
不以严格TS为由破坏已有运行时宽容行为。最终对照与修复日志单独保留。

最终24项候选要求在旧源码20失败/4正常通过，候选与历史/契约共70项通过；专项lint、正式三格式构建通过。广浏览器矩阵87项通过，最后falsy修正后受影响27项重跑通过，另60项未受影响的历史/原生检查不重复计数。最终完整CI1048项通过（938单元+14工程+96基线），另44项契约重复观察，284个生产TS文件严格检查。CANVAS-LIFE-01与记录的桌面CANVAS-PIXEL-01关闭，类型/分发/设备仍待04～06。本任务done并独立本地提交，不推送/发布。
