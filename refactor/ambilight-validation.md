# Ambilight 测试维护

先读 [发布契约](baselines/ambilight-contract.md)。ambilight-release.json冻结两个真实
发布及工作区Git来源，verifyAmbilightContract逐成员核对，不随候选更新历史哈希。

`node --test refactor/scripts/ambilight-contract.test.mjs`执行7组：归档、CJS/script/legacy、
原生ESM、声明形状及三实现的配置/样式/坐标/同步返回。test/helpers/ambilight.js提供
受控DOM/Canvas/RAF；模拟RGB只检查取样及写入顺序，不证明浏览器解码或跨域取色。

02复现频率/暂停/零尺寸/重复start-stop/销毁/异常；03拆分视图、取色和调度，修复已
复现问题；04兼容类型及旧CJS.default；05/06做真实媒体、代理、浏览器和安装包验证。
stop保留最后画面，核心destroy终止资源。zIndex仍忽略，参数省略及两版声明差异分别
处理；Git关联不构成连续核心支持范围。
