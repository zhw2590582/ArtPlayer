# 弹幕遮罩

[English](../en/plugin/danmuku-mask.md)

通过人体分割结果生成 CSS 遮罩，让弹幕避开视频中的人物区域。插件处理核心的 `.art-danmuku` 层，不修改弹幕队列、条目或视频画面。本页描述未发布重构分支，不将在线示例或导航验证视为模型效果验收。

## 安装和示例

```sh
yarn add artplayer artplayer-plugin-danmuku artplayer-plugin-danmuku-mask
```

```js
import Artplayer from 'artplayer';
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku';
import artplayerPluginDanmukuMask from 'artplayer-plugin-danmuku-mask';
```

script 用法先加载核心及两个插件的 dist 文件，全局名分别为 `artplayerPluginDanmuku`、`artplayerPluginDanmukuMask`。[原在线示例](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-danmuku/index.js%0A./uncompiled/artplayer-plugin-danmuku-mask/index.js&example=danmuku.mask)按此顺序注册，并从站点自己的路径加载 MediaPipe 资源：

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js&#10;./uncompiled/artplayer-plugin-danmuku-mask/index.js">▶ Run Code</div>

```js
// npm i artplayer-plugin-danmuku-mask
// import artplayerPluginDanmukuMask from 'artplayer-plugin-danmuku-mask';

// npm i @mediapipe/selfie_segmentation
// 把 node_modules/@mediapipe/selfie_segmentation 目录复制到你的项目下

const art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/steve-jobs.mp4',
  autoSize: true,
  fullscreen: true,
  fullscreenWeb: true,
  autoOrientation: true,
  plugins: [
    artplayerPluginDanmuku({
      danmuku: '/assets/sample/danmuku.xml',
    }),
    artplayerPluginDanmukuMask({
      solutionPath: '/assets/@mediapipe/selfie_segmentation',
    }),
  ],
})
```

部署时确保 solutionPath 下有匹配的 MediaPipe 资源。复制目录本身不证明所有脚本、模型、WASM、网络策略和浏览器能力都可用。

## 配置

配置可省略，注册时读取并保存这些值：

| 字段 | 类型 / 默认值 | 实际用途 |
| --- | --- | --- |
| `solutionPath` | `string` | SDK 资源根路径；默认 CDN 未固定版本 |
| `modelSelection` | `number` / `1` | 历史转发字段，不能据此认为当前模型已切换 |
| `smoothSegmentation` | `boolean` / `true` | 历史转发字段，显式 false 保留 |
| `minDetectionConfidence` | `number` / `0.5` | 历史转发字段 |
| `minTrackingConfidence` | `number` / `0.5` | 历史转发字段 |
| `selfieMode` | `boolean` / `false` | 历史转发字段 |
| `drawContour` | `boolean` / `false` | 传给二值遮罩转换 |
| `foregroundThreshold` | `number` / `0.5` | 传给前景阈值转换 |
| `opacity` | `number` / `1` | 传给 SDK drawMask，不是直接设置弹幕层 opacity |
| `maskBlurAmount` | `number` / `3` | 传给 SDK drawMask 的模糊量 |

solutionPath 默认指向未固定版本的 [jsDelivr MediaPipe 资源根目录](https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation)。

除 smoothSegmentation 的 undefined 判断外，默认值沿用 `value || default`。例如 modelSelection、opacity、threshold、blur 的 0 会回退默认值，不能用于关闭功能；停止遮罩使用 stop。

当前固定选择 `runtime: 'mediapipe'` 和 `modelType: 'general'`。已安装的 adapter 把 general 映射为 modelSelection 0，并忽略部分额外转发字段；保留参数不是承诺这些字段都会改变推理。TensorFlow 后端先尝试 webgl，只有拒绝时才尝试 cpu；这也不能证明 MediaPipe 实际使用哪种推理后端。

## start、stop 与失败

注册同步返回 `{ name: 'artplayerPluginDanmukuMask', start, stop }`，可从 `art.plugins.artplayerPluginDanmukuMask` 访问。ready 自动启动；如果在 ready 之后安装，需要自行调用 start。

| 方法 | 行为 |
| --- | --- |
| `start()` | 返回 `Promise<void>`；初始化并启动调度，不等待第一张完整遮罩 |
| `stop()` | 同步返回 undefined；取消当前调度并立刻将层的 maskImage 设为 none |

重复 start 不创建重叠推理循环。stop 可在初始化过程中调用，使公共 start 及时结算；不可取消的 SDK 工作仍被观察，迟到结果不再写入遮罩。之后 start 等待旧任务和释放过程结束再重新初始化，不以多个模型并行掩盖停止问题。

模型创建失败会记录错误且 start 可正常结算，但没有可用模型；可显式再次 start 重试。后端或必要 DOM/Canvas 初始化失败仍可能拒绝 start。自动 ready 启动会记录拒绝。推理或像素读取失败记录错误并继续下一次调度，保留上一张可用遮罩。

只在视频播放、未结束且有有效尺寸时执行分割。结果经二值遮罩、drawMask 和 Canvas 像素转换生成 PNG data URL，写入整层 maskImage。没有人物结果时保留之前的遮罩；遮罩精度、性能和跨域像素访问需要实际视频验证。

## 生命周期和类型

播放器销毁停止运行并移除 ready/destroy 监听器。私有画布归插件所有，SDK 工作完成后重置其尺寸并释放模型。stop 不是 GPU 内存回收完成的 Promise；SDK 的私有资源实际释放完成仍需独立证据。插件不提供公开 destroy、update 或新事件，也不接管其他应用的全局 TensorFlow 生命周期。

根和 `/legacy` 保留历史声明：可选配置、同步注册、异步 start 和同步 stop；没有 `/runtime` 子路径。Option/Result 是声明内部类型，可通过工厂提取。下面仅展示 NodeNext ESM 下的类型提取，不执行 `.default` 调用：

```ts
import type MaskModule from 'artplayer-plugin-danmuku-mask';

type MaskFactory = typeof MaskModule.default;
type MaskOptions = Parameters<MaskFactory>[0];
type MaskResult = ReturnType<ReturnType<MaskFactory>>;

const options: MaskOptions = { solutionPath: '/assets/@mediapipe/selfie_segmentation' };
async function restartMask(mask: MaskResult): Promise<void> {
  mask.stop();
  await mask.start();
}
```

保留的 NodeNext 根类型有模块命名空间行为；这不代表当前运行时工厂有 `.default` 属性。当前 CommonJS 工厂直接调用，ESM 运行时使用默认导出；不要从类型命名空间推断运行时别名。旧版导出形状、模型真实运行和真机性能各自独立验证。
