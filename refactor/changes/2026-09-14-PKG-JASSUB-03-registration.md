# PKG-JASSUB-03 自有注册与清理职责

入口仅保留惰性工厂，新增 registration.js 管理实例构造后的样式、宿主监听和
失败回滚。仍在 registrar 调用时读取 art.video 再展开原 option；返回同步的
原 vendor 实例，不复制 options、不包装公开 instance、不绑定或改写其 destroy。
两文件职责明确，未建立额外通用框架。vendor JS、Worker/WASM、字体、声明未变。
严格 TS/公开类型迁移继续由 04 处理；vendor 的实质修复在独立 07 中完成。

## 修复及兼容边界

只有 vendor 创建了 _canvasParent 时才设置原 z-index=20。用户自定义 canvas
不再在 Worker 创建后因空 parent 抛错，canvas 节点仍归调用者，销毁后不删除它。
宿主清理检查 vendor 已销毁状态，并在调用期间防同步重入；仍动态查找当前
instance.destroy，所以用户包装该方法继续生效。正常销毁错误原样传播，
内部 guard 在失败时复位，允许下次尝试；成功后本次注册不重复清理。

构造成功后若样式或宿主订阅失败，分别尽力移除相同 callback 并销毁实例，
始终抛原错误。off 自身失败不会阻止尝试释放实例；这种异常宿主可能保留已
失效的 callback，不能宣称已强制清除所有外部状态。vendor 构造尚未返回实例
时的遗留资源，以及 vendor 自己的 destroy 再次调用、跨父节点、旧 RVFC 和
ratechange 问题继续保留在 07。JASSUB-DESTROY-01 因而仍 open。

## 验证

新增八项候选回归：自定义 canvas、直接再宿主销毁、ready 前销毁、同步重入、
错误传播/重试、订阅失败的两个回滚边界、样式失败。相同断言先对未重建的旧
工作区主产物运行，1 通过/7 失败；改造源码八项通过。历史 63 项失败/保护断言
保持原期待，本包联合 128 项通过；候选公共行为七项通过。

正常脚本构建 main/legacy/ESM 并生成 docs 副本，产物各 15 项公共行为和清理
测试通过。原生浏览器以实际候选产物和真实 Worker/WASM/字体验证自定义 canvas、
seek 后字幕、网页全屏、直接 instance.destroy 再 art.destroy(false)，并检查
调用者 canvas 保留、Worker 只终止一次。运行选择、数量和指纹见
[验证记录](../baselines/jassub-registration-validation.json)。自定义 canvas 矩阵
显式使用 onDemandRender=false；不能据此关闭 WebKit 默认逐帧问题。默认逐帧
模式另测 Chromium/Firefox 的 vendor 创建容器路径，仍保留原生验收边界。

test:jassub 与 test:unit 加入候选注册测试。原生测试支持
ARTPLAYER_JASSUB_ARTIFACT 指定实际 global 产物，ARTPLAYER_JASSUB_CUSTOM_CANVAS=true
指定调用者 canvas，报告区分 npm 归档与候选文件。没有提供这些参数时仍是
02 的真实发布基线；该套件不把 ESM 当普通 script 加载。

定向 lint、原有来源/资产校验及计划/风险校验通过；没有新增依赖、
锁变化或远端运行。本次关闭自定义 canvas 的 adapter 缺陷，其他实例、设备、
字体许可与完整分发问题保持原任务门槛。回退 index/registration 并正常重建
即可恢复原行为；不要直接编辑 dist。独立本地提交，不推送或发布。
