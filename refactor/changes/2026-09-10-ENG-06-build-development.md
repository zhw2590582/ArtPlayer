# ENG-06：JS/TS 构建与非交互开发

日期 2026-09-10；起点 77148242；分支 codex/compatible-modernization。

build/dev 已共用入口解析与选包，保留交互、输出路径、三格式和目标语法，新增包参数与 dev --no-open。选包/入口错误先失败，dev 重建串行化并可从源码错误恢复。工具职责与完整运行步骤见 [维护说明](../build-development.md)。

新增真实构建夹具和三个 Node 测试，覆盖 TS+JS+Less+SVG+inline worker、三格式消费者、错误输入不清理已有产物、合并通知和失败重试。夹具复现旧 AMD 补丁将工厂参数误当全局的问题 BUILD-AMD-01；现按包装实际参数修复，未知格式拒绝构建。现有 API/global/CJS/ESM 路径未变，修正范围仅原先丢失的 AMD 全局赋值。

隔离 checkout 使用相同依赖和正常脚本完成改动前后各 21 库/63 产物构建。39 字节相同；24 只改 AMD 接收者，逆变换后的全部哈希回到旧结果。内置浏览器 Chrome/152 UA 验证 42 个实际 UMD/legacy AMD 入口，全部通过；TS 夹具的 Less/SVG、真实 worker 41->42 往返通过；修改 JS 依赖后值由 42->43，故意破坏 TS 后修复可重新构建并恢复 42。

现有首页的真实新 JS dev 构建、Monaco 加载、本地 MP4 metadata（640 宽、约 90.046 秒）、播放推进（13.678864 秒）及暂停已验。最终浏览器 error/warn 为空。开始时旧标签失效和 inventory 查询失败，直接新建内置标签后恢复；没有依赖 Chrome 连接。初始 Node VM 全库导入缺少部分 DOM/global API 的 8 个错误不作为包失败或通过，已改在实际浏览器检查全部 42 项。

完整 ci:check 通过 lint、类型及 21 Node +22 基线测试，共 43 项；原交互选择在真实 TTY 按 Enter 构建核心成功。最终按多个包参数重建的 63 产物与已验证候选全同；另生成的 22 个 i18n 文件与此前 checkout 字节相同。检查结果和产物指纹保存于 [验证数据](../baselines/build-validation.json)。未更改生产包版本、公开声明或根分发产物；没有把构建验证扩写为完整 SDK/真机或 npm 发布验收。

独立提交 ENG-06，可单独撤销工具改动；后续用新工具生成候选，禁止拿本轮验证替代实际发布 tarball。下一项 ENG-03 统一已有公共行为/单元夹具，再接 ENG-05 浏览器自动化和 chapter 的特有行为/源码迁移。
