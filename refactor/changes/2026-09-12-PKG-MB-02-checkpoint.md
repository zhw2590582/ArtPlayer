# PKG-MB-02 首批媒体与销毁负例检查点

本任务进行中，不计为完成。MB-01完成提交为1cfd2e17，完整CI1161项属于该提交；
本检查点新增测试按影响范围执行22项Node（19基线+3历史缺陷）及6项浏览器，不将旧CI计为本步完整CI。

## 已复现的历史缺陷

两份真实npm主产物及冻结工作区均使用实际engine.load/destroy，替换performLoad为受控未完成请求。
destroy没有推进loadSeq，waiting/loadstart两个timer继续保留；晚到失败先发error并写networkState=3，
之后仍能执行waiting/loadstart。三个精确负例通过；它们证明旧问题存在，不代表候选已修复。
宿主为受控ArtPlayer事件对象，不能据此断言完整核心销毁后外部监听器仍收到事件。

## 真实浏览器结果

实际npm核心5.4.0 × proxy 1.0.0/1.2.0 × 三引擎，共6项：

- Chromium、Firefox的4项：真实MP4加载，播放时钟>0.15秒，320×180 Canvas，红/蓝采样像素及alpha，暂停状态通过。
- 当前Windows WebKit的2项：VideoDecoder、AudioDecoder、AudioContext和webkitAudioContext均不存在；
  实际旧proxy出现code=4和构造器错误、未ready、尺寸0。测试验证此精确能力失败，没有skip，
  但不能把这两项称为播放通过，不能扩大为所有Safari不支持。
- 所有项保留实际proxy字节哈希、核心资源manifest、浏览器版本/平台、媒体状态/事件、页面错误和请求诊断。

第一次探索等待ready时使用了Playwright默认30秒超时，保留6个截图与trace；正式测试已使用
expect.poll和明确的能力失败断言，不再靠超时或catch任意错误判通过。
正式报告与整个results目录归档于`.cache/mb02-first-results`；探索报告位于`.cache/mb02-native-probe-3ZcV99`。

## 复跑与剩余范围

```sh
node --test test/mediabunny.test.js refactor/scripts/mb-contract.test.mjs
yarn test:browser test/browser/mediabunny.spec.js
```

还缺：WebM、HLS、Blob/Stream、真实seek、无音轨/无视频/无轨道、超时和取消、并发选轨与
就绪事件次数、音画同步及资源释放。原生DPiP、长播放、新旧核心完整组合留MB-09。
MPL来源/通知仍MB-10，Canvas/Ambilight类型取舍仍未决定。

实现和用例影响由[机器记录](../baselines/mb-media-checkpoint.json)描述，当前PKG-MB-02保持doing。
