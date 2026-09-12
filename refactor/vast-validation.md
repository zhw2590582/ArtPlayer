# VAST 测试维护

当前完成 PKG-VAST-01/02；生产重构由03/04继续。来源见
[实际契约](baselines/vast-contract.md)、[VAST/SDK归档](baselines/vast-release.json)
和 [核心5.1.7归档](baselines/vast-core.json)。工作区1.2.0不是npm发布版本。

## 文件与执行

- `test/helpers/vast-sdk.js`：可在Node和浏览器使用的SDK记录器，控制加载、构造、
  监听、请求、销毁失败和晚到事件；不实现IMA、广告请求或主片暂停恢复。
- `test/helpers/vast.js`：只在精确的`@glomex/vast-ima-player`导入边界替换SDK。
  当前JS/TS入口可打包加载；两套历史源码必须来自哈希验证的npm归档/Git内容。
  Node宿主仅提供事件和DOM所有权意图，不模拟布局或视频解码。
- `test/vast.test.js`：共享契约、工作区新增功能、独立的历史缺陷观察。
  修复时为当前候选增加正确行为断言，保留历史缺陷复现，不能把旧缺陷移入共享契约。
- `test/browser/vast.spec.js`：三真实浏览器×三核心，测试异步注册、加载失败、真实
  DOM显隐、显式清理重建、主片解码/切源和销毁后晚到初始化。SDK仍是同一受控记录器。
- `refactor/scripts/vast-core.test.mjs`：实际5.1.7 tarball、197成员和发布关联检查。
- `refactor/scripts/vast-contract*.mjs`：VAST及SDK归档、真实发布导出和冻结源码契约。

使用仓库固定Node24.21.0与Yarn1.22.22：`yarn test:vast`、`yarn test:baseline`、
`yarn test:browser vast.spec.js`。Node用例纳入`test:unit`，浏览器用例由常规Playwright
流程发现。8084浏览器运行串行执行；每次报告/完整results先归档再开启下一轮。
所有失败日志保留；不改超时、不加重试、不能把外部SDK受控替换说成供应商服务通过。

## 已复现问题与修复入口

VAST-LIFE-01由源码观察提升为受控运行复现，问题如下：

1. 核心destroy不清理SDK；真实浏览器中旧插件在核心销毁后仍能分配到已脱离文档的player。
2. SDK加载中销毁后仍执行callback并初始化。
3. callback拒绝后已分配SDK和容器保留。
4. callback等待中销毁，恢复后仍可请求广告。
5. SDK构造失败后容器不回滚。
6. 同毫秒多个实例产生重复ID。
7. 工作区活动广告destroy后状态未复位，新的play请求被永久忽略。
8. 工作区晚到SDK回调在destroy后抛错，重建后可污染替代容器与状态。
9. 工作区SDK destroy抛错阻止DOM及引用清理。
10. 工作区事件注册失败后留下不完整SDK，下一次init错误地认为它已就绪。

03应建立明确的生命周期/SDK/DOM所有权，并区分可重建的显式广告destroy与终止性的
核心destroy。04处理准确类型、SDK声明依赖和同步误声明；初始化冲突应以发布及
工作区消费者证据明确处置，Ads的专属类型批准不能扩展到VAST。

## 验证边界

这些测试不是实际Google IMA加载、广告加载/播放/跳过/内容恢复的验收，也没有检查
物理移动设备或最终npm tarball。SDK记录器对load错误、constructor错误、destroy错误
使用精确注入；Node固定Date.now用于同毫秒ID复现，未改变生产时钟。

只有实际VAST外部脚本持续因VPN无法加载时，可按用户授权记录并跳过该网络验证；
它不豁免类型、生命周期或其他包。到02为止未用该例外。03～06和SDK-07继续开放。
