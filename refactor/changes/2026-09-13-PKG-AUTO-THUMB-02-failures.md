# PKG-AUTO-THUMB-02 旧失败回归与原生像素

在八份冻结夹具上增加64项失败行为对照，覆盖销毁/切源/重复metadata/逆序编码/
null Blob/draw与encode异常/缺context与media错误/核心setter异常。
保留01正常契约，根脚本新增test:auto-thumbnail并将64项纳入test:unit，无新依赖。

新增9项三浏览器原生HTTP/video/seek/JPEG/URL/像素测试，手动延迟原生编码结果交付以
确定性复现销毁后更新和逆序覆盖。没有将宿主替身包装成核心联调，原生媒体内容未伪造。
WebKit首轮像素失败后增加四格采样、独立loadeddata、可见静音播放和静态红色JPEG对照。
播放/静态阳性对照均成功，旧抽帧路径四点仍黑，故作为待修缺陷而不是能力豁免。
诊断失败运行完整保留，最终历史断言9项通过并不代表候选已修复。

AUTO-THUMB-LIFE-01和AUTO-THUMB-ENCODE-01从source-observed变为reproduced，
新增AUTO-THUMB-PIXEL-01；均保持open。无效输入/重入/跨实例等候选边界继续03补齐。
下一步修改生产源码并建立候选成功标准；04保留独立TS/类型工作。

见[故障表](../baselines/auto-thumbnail-failures.md)及
[验证](../baselines/auto-thumbnail-failures-validation.json)。
回退此提交只移除本步测试/脚本/记录；生产代码、发布版本、dist均未变。独立本地提交，
不推送、不发布。

最终完整CI1766项（1520单元+14工程+232基线）、339生产TS检查通过；历史原生9项通过，
没有重试/跳过/未处理浏览器错误。源码修复是独立03任务，不把历史缺陷复现记为修复完成。
