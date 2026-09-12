# Ambilight 实际发布与工作区契约

PKG-AMBILIGHT-01；来源c57c7e4b。实际npm有1.0.0、1.1.0，后者为采集时latest。
两份tarball各6成员，完整哈希见ambilight-release.json；1.1.0不含src，直接核对dist。
工作区源码、声明、README、manifest和demo另以Git冻结。目标2.0.0由REL-09修改。

## 运行时

注册时才读取配置，默认blur=50px、opacity=0.5、frequency=10、duration=0.3。同步返回
{name,start,stop}，两方法返回undefined。省略option可用，null在注册时抛错；创建工厂
后、注册前的配置修改可观察。没有额外公开事件或destroy方法。

video之前插入artplayer-plugin-ambilight，绝对定位3×3网格，zIndex固定9；声明里的
zIndex从未读取。9子节点保留filter、opacity和background-color transition。ready自动
start；stop停止更新并保留最后颜色，start可恢复。playing且达到频率间隔时，将9个
视频区域分别缩至1×1读取RGB。暂停仍调度RAF、不取色。特殊频率语义由02补齐。

## 公开差异

| 维度 | npm1.0.0 | npm1.1.0/工作区 | 迁移处理 |
| --- | --- | --- | --- |
| CJS | namespace.default | 可调用工厂 | 保留两种调用形式 |
| ESM | 无独立mjs | mjs默认导出 | 保留真实ESM入口 |
| 类型导出 | export=、全局声明 | export default | 04验证旧require/import=及新默认导入 |
| Option字段 | 五字段必需 | 五字段可选 | 这是已发布历史变化，不是候选修正 |
| 工厂参数 | 声明要求option | 同左 | 运行时允许省略；兼容补齐声明 |
| zIndex | 声明有、运行时忽略 | 同左 | 继续接受旧输入并保留固定层级 |

README只有demo链接；当前demo明确传blur/opacity/frequency/duration。不能凭声明里的
zIndex悄悄启用新布局行为。01核对真实声明形状，不把正则检查冒充完整消费者编译。

## 后续验证

destroy只stop，未清DOM/监听器；逃逸start可能重启；RAF的truthy检查会混淆id=0；
空context、零尺寸和取色异常可能中断循环。目前登记源码观察，02必须复现、03修复。
stop保留视图与核心destroy终止资源应分开，不能新增用户必须调用的方法。

registry gitHead对应核心5.1.7/5.3.1，仅是Git关联，不是tarball可复现或支持区间证明。
未声明peerDependencies，05须实际验证旧核心/候选、Canvas代理及媒体能力。Canvas
依赖可取色媒体、2Dcontext和origin-clean；Node记录器不证明浏览器像素或真机行为。
01共7组检查，维护入口见 [Ambilight测试说明](../ambilight-validation.md)。
