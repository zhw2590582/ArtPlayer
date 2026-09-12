# PKG-AMBILIGHT-PROXY-01 Canvas输出取色边界

从05组合检查中拆出可独立验证的源码修复；05仍需最终代理迁移后的组合和设备证据。
当前实际proxy-canvas源码由本步输入哈希固定，未把工作区代理版本当作npm历史包。

## 复现与修改

原生canvas proxy在输出buffer改变尺寸后仍转发底层videoWidth/videoHeight。Ambilight
原实现按转发媒体尺寸截取canvas，导致九宫格采样偏向左上角；浏览器真实视频解码后
通过代理公开callback绘制九色native Canvas图案，以均匀颜色直接验证各区域取色，
不mock像素读取、代理工厂或媒体播放。初始Chromium中5.4.0/候选核心均取错颜色。

采样模块内部来源类型明确为HTMLVideoElement或HTMLCanvasElement；根据nodeName
区分Canvas输出，使用其width/height。原生video仍使用videoWidth/videoHeight，显示
宽高不影响取色。保留频率/生命周期/公共Option/Result及所有导出；Canvas零输出
尺寸不采样，恢复尺寸后可继续。不使用跨window容易失效的instanceof判断。

3项Node用例在修改前2失败/1正常视频通过，修改后与既有回归共56项通过。覆盖输出
二次resize、原生视频显示尺寸与零Canvas输出恢复。完整三格式构建、专项lint/严格
TS以及完整CI978项通过（881单元+14工程+83基线），另44项重复契约观察。

## 纠正历史能力假设

最初把5.1.7也当作canvas组合，读取不到代理draw回调；增加ready等待仍失败。
诊断附件明确实际节点为VIDEO，而不是CANVAS。核对实际npm5.1.7的option声明和
浏览器Artplayer.option均没有proxy配置，证明旧核心直接忽略该选项。这不是Canvas
取色修复失败，也不能声称对该核心验证了代理。最终用单独能力断言记录该历史限制，
同时确认原生Ambilight仍可播放取色；不会向旧核心注入虚构代理支持。

最终浏览器矩阵包含6项真正canvas组合（5.4.0/候选×三引擎）、3项5.1.7无proxy配置
但原生播放的能力对照、18项既有原生视频生命周期/跨域恢复。失败与通过报告分开归档。

Canvas代理本身仍是未迁移代码，其异步绘帧/终止/事件归属继续由PKG-CANVAS-01至06
核验；本步不能据“移除了Ambilight DOM”推断代理已无残余RAF。05增加PKG-CANVAS-04
前置依赖，在依赖满足前保留todo并记录预检证据；06完整分发/demo也未完成。本子任务
完成后独立本地commit，无推送/发布。下一步推进PKG-CANVAS-01发布契约，随后迁移代理。

## 验证收尾

最终27项浏览器全部通过，无skip；56项Node专项通过，278个生产TS文件严格检查。
报告、输入哈希、初始颜色错误/中间能力诊断和完整CI日志见
[验证证据](../baselines/ambilight-proxy-validation.json)。期间计划检查正确拒绝了新依赖
未完成却将父任务标doing的状态；已改为依赖满足前todo，再完成本子任务。格式lint
修正仅将对象字段换行，未修改已经通过的浏览器测试含义。
