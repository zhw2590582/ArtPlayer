# PKG-ASR-05 编辑器生成修复检查点

完整执行 `yarn build:ts` 时发现 ASR 尚走旧文本拼接路径。新增的公开命名类型和
原有 `export default` 被直接保留，再拼接 `export =`，在严格独立编辑器编译中
产生 TS2309。此问题已修复，不只登记后推迟处理。

ASR 现在使用现有语义生成器：公共类型归入全局命名空间，默认工厂仍保持历史
同步声明，准确 RuntimeOption/RuntimeResult/RuntimeFactory 作为独立类型可用。
运行时源码、npm 根声明及播放器行为没有改变。

`test/editor-types.test.js` 重建旧文本生成结果并断言 TS2309；对新声明验证普通
工厂替换、历史 void stop、精确异步 stop 与显式 capture 输入。TS 5.9.3 和 4.3.5
均在 strict、skipLibCheck=false 下通过，并各拒绝三个指定反例。生成产物与
格式化结果逐字核对。两项编辑器测试通过，日志为
`refactor/.cache/asr-editor-tests.log`，生成日志为
`refactor/.cache/asr-editor-generation.log`。

此修复作为 ASR-05 的独立本地检查点提交；ASR-05 的真实设备等剩余验证仍未完成。
未将静态声明测试描述为新的浏览器播放证据，也未推送或发布。
