# PKG-AMBILIGHT-04 公开类型与历史导出兼容

03已完成自有生产源码的严格TS拆分；04补齐公共声明、Node解析模式和真实安装消费者。
最终验证结果见 [类型与安装证据](../baselines/ambilight-types-validation.json)。

## 兼容门面

工厂增加指向自身的default属性：同时支持1.0.0的require(pkg).default、1.1.0的直接
require调用和ESM默认导入。公共声明使用callable与类型namespace合并；Option/Result/
Callable/Factory可显式导入，start/stop仍为void、name仍是原字面量。可选调用重载补齐
省略参数及undefined，最后一个必填Option重载保持Parameters<typeof factory>[0]不增加
顶层undefined。zIndex保留但清楚标注运行时忽略。

1.0.0所有字段必填，1.1.0已经改成可选；旧的“读取字段一定是string/number”推导差异
是已发布历史变化。本候选保持1.1.0推导，不能声称恢复1.0.0的必填字段推导，也没有
套用Ads的专属批准。两版实际声明和合法调用分别编译对照，精确断言已有差异。

main/module/legacy/types旧路径保留；import和require分别增加d.mts/d.cts转发，旧TS
通过typesVersions解析legacy。编辑器改用已有语义生成器，重新运行build:ts，不手改
生成声明。包排除tsconfig.json，修复真实pack发现的实现配置泄漏。

## 证据范围

新增类型/产物测试先在03状态运行：4组中3失败，历史调用对照通过。工作区测试覆盖
TS5.9.3的Node10/NodeNext CJS、ESM/Bundler及TS4.3.5，10项非法用法去掉expect-error后
必须逐项报错。编辑器消费亦有负向断言；Node执行正式main/legacy/global/ESM产物。

新脚本test:ambilight-types-package在仓库外安装两个真实npm发布及候选tarball，搭配
同一打包候选核心；核对每个已安装文件哈希、非workspace链接、离线及frozen二次安装。
候选额外验证两个TS版本关闭esModuleInterop仍可默认导入。旧npm1.1.0在NodeNext ESM
实装中暴露默认导出不可调用的既有错误，按精确4个诊断保存，候选该模式必须零诊断。
不修改历史包或把该错误当作候选容许失败。

本步没有新依赖；只添加专项脚本和消费者。代理/实际设备归05，完整分发/8082 demo及
安装包浏览器归06；本步包内README/架构说明同步更新，未推送或发布。

## 最终验收

四组专项检查通过；真实安装17个场景中候选7个、历史9个零诊断，另1个历史场景按
固定4条诊断核验。候选每个场景去掉expect-error后均拒绝10项非法输入。正式三格式
与编辑器生成通过；完整CI975项通过（878单元+14工程+83基线），另44项重复契约观察，
278个生产TS文件严格检查。18项三核心/三引擎原生Canvas媒体回归通过，无skip。

AMBILIGHT-TYPE-01及AMBILIGHT-DIST-01对应的已复现类型/导出问题关闭，本任务独立
本地提交并审计自身。关闭这两条具体问题不等于05/06或npm发布验收完成；VAST专属
VPN外部脚本例外没有用于本任务。
