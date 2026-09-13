# PKG-MASK-04 严格TS与公开类型兼容

## 实现与公开接口

五个自有运行模块迁为TS，types.ts明确最小核心宿主、原始可选参数/完整配置、SDK
额外历史传参、输出画布及每轮可空资源。类字段declare不产生新字段；局部断言说明
对应初始化、Promise resolver或RGBA长度约束。实际Artplayer宿主fixture通过严格检查。
相对MASK03提交aba125262，五模块归一化JS和三种正常构建产物保持一致。

公开声明与npm1.0.0/1.1.0保持字节一致（忽略换行）。原参数可选、同步注册、
Promise<void> start、void stop、固定name、完整工厂双向赋值及类型提取继续保留。
这些返回值本就准确，不为形式统一额外增加/runtime入口或暴露内部SDK类型。

## 两项类型工具修复

实际严格消费者先复现旧Node模块解析下/legacy报2307，现以精确typesVersions路径
映射修复；默认工厂声明与其他入口未变，历史直接声明路径仍验证。npm两版在相同
模式均记录旧失败，候选只允许消除此特定行的2307；NodeNext ESM根命名空间诊断
保持历史结果。根CommonJS最新是函数无default属性，1.0.0对象包装单独验证。

旧在线编辑器生成器把export default和export=混在一起，实际旧文件在两个编译器
均报2309。接入现有语义生成器，生成文件正例及三项非法调用反例通过。私有Option/
Result不改为新增公开类型；消费者用Parameters/ReturnType提取，生成内容校验防漂移。

SDK严格声明另复现TF4.22.0的hash_util.d.ts缺少Long import。声明专用sdk-ambient.d.ts
引用已安装官方@types/long4.0.2，不产生运行时导入、没有重写第三方类型，也不改
types:[]或skipLibCheck:false。包src和tsconfig均不进入tarball。

## 验证

Node24.21.0下联合99项通过：36候选生命周期、54历史缺陷、6历史契约、3公共/编辑器
类型测试。定向lint、全仓404生产TS及当前/兼容编译器流程通过。三种产物正常重建，
docs副本一致，生成编辑器声明通过正反例和文件一致性验证。

最终Yarn实际pack将旧npm1.0.0/1.1.0和候选分别安装到仓库外，复制根锁作依赖种子，
离线安装后再次frozen安装并逐字节核对包内容/锁文件。每包TS5.9.3的Node10、NodeNext
CJS/ESM、Bundler及TS4.3.5的Node10，共15组；每组8项非法输入/返回值独立报错。
实际安装main和legacy执行同步注册/stop/destroy，但不启动模型；不称为播放或SDK
验收。旧Node10/legacy失败用既有直接声明路径核实工厂，其原错误保留在报告。

复跑：yarn test:danmuku-mask、node --test refactor/scripts/danmuku-mask-types.test.mjs、
yarn test:danmuku-mask-types-package、yarn typecheck、yarn build:ts artplayer-plugin-danmuku-mask。
新增安装检查脚本复用现有Yarn/TS版本，无新增依赖或锁文件改动。包内架构及types/README
解释维护路径和历史边界。详见[类型验证](../baselines/danmuku-mask-types-validation.json)。
同步更新风险、SDK来源与影响映射中的当前源码路径，冻结历史JS夹具不改；风险和影响
检查通过，没有因迁移路径失效而忽略SDK或插件组合验证。

## 剩余工作与回退

05仍负责真实模型、原支持范围核心、浏览器/设备/切源/布局/后端与GPU资源；06负责
完整分发、许可、示例和发布验收。WebKit/Chrome设备能力和SDK的close完成仍未证明。
本任务不关闭这些风险、不改变各包独立major发布政策，不推送或发布。
回退此任务源码/类型解析及生成器选择后正常重建即可；03生命周期修复是独立提交。
