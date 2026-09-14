# PKG-HLS-PACK-01 排除 npm 包中的内部 tsconfig

CI-01 的十二包真实打包在 HLS Control 被现有 checkFiles 拒绝：.npmignore 排除了
src，却遗漏 tsconfig.json。该内部配置引用仓库根目录，不属于公开消费者入口。
给排除规则单独添加 tsconfig.json；公开 JS、声明、导出和运行时行为不变。

使用同一隔离源码构建快照，以固定 Node 24.21.0 / Yarn 1.22.22 实际 pack 比较：
旧归档准确复现 Implementation tsconfig leaked，新归档完整文件校验通过，仅移除
package/tsconfig.json；六个 dist/types 文件和 package.json 精确字节不变，实际旧版
全部分发文件保留。现有泄漏负例与实际归档校验组成回归证据，不增加镜像测试。

实施中首次追加遇到旧 ignore 文件无末尾换行，导致 src 与新规则拼接；实际包检查
又正确拒绝 src 泄漏。已改为两条明确规则，中间失败归档保留，没有覆盖首轮错误。
见 [机器证据](../baselines/hls-pack-config-validation.json)。这不代表重新验证播放、
全包模块消费或完整十二包安装。CI-01 接续实际安装与浏览器验证，HLS-06 仍开放。

包内 ARCHITECTURE.md 记录产物边界。没有更换依赖、锁文件或生成 JS；撤销本任务
会恢复内部配置泄漏。未推送或发布。
