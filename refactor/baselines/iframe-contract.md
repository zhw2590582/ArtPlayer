# iframe 工具的发布与工作区契约

来源：[冻结清单](iframe-release.json)。查询npm时artplayer-tool-iframe返回404；这只说明
该次查询不可获得包，不能推导历史上从未发布。实际旧包artplayer-plugin-iframe只有1.0.0，
发布于2022-11-05，gitHead关联核心4.5.9；仓库改名提交为1c75731ca。
当前工具版本1.1.0和发布包不是同一版本/包名，不得编造tool@1.1.0归档或拿重构产物代替旧包。

## 入口与文件

| 范围 | 已核实的真实形状 |
| --- | --- |
| npm plugin@1.0.0 | 8文件，含README、package.json、src、声明、4个JS产物；无module/exports |
| 主main/legacy | CommonJS是含default的namespace，浏览器window.ArtplayerPluginIframe是类 |
| 额外helper main/legacy | namespace.default及window.ArtplayerHelperIframe；有不同协议，不是主类别名 |
| 旧声明 | export = / export as namespace ArtplayerPluginIframe；与运行时require返回namespace存在既有偏差 |
| 冻结工作区tool@1.1.0 | main/legacy直接导出类，浏览器ArtplayerToolIframe；mjs只有default；root/legacy条件入口 |
| 工作区声明 | default类ArtplayerToolIframe，旧readonly字段和resove拼写保留；静态onMessage仍声明void |

初始工作区11个输入由Git固定：源、类型、README、manifest、npmignore、三产物、父demo、
子iframe.html和编辑器声明。旧归档SHA512/SHA256与每个成员SHA256均核验；auxiliary helper
也在验证中，不能漏掉它后再说旧包只有一个公共类。旧包导入名与新工具名的分发迁移、额外
helper入口是否提供独立兼容门面，由IFRAME-04/06明确处理，不能把旧helper强行映射成新类。

## 主类与协议

构造参数仍为必需的{iframe: HTMLIFrameElement, url: string}。校验属于当前realm的iframe；
先注册message监听，再设置src。自身可枚举字段顺序为url、$iframe、promises、injected、
destroyed、messageCallback、绑定的onMessage。旧发布包非法参数抛Error，工作区已改为TypeError，
这是改造前已有差异；不能把两者报告为完全相同。

- static iframe读取window.top !== window；inject/postMessage/onMessage只能用于子frame。
- inject先发{type:'inject', data:undefined, id:0}，再addEventListener；没有静态destroy。
- static postMessage默认id=0，向window.parent发送，targetOrigin='*'。
- 实例postMessage返回Promise；未inject时每200ms轮询，发出时使用Date.now()覆盖传入id。
- promises[id]的公开字段是resove/reject，不能直接“纠正”resove拼写。
- 收到inject设置injected；同id的error拒绝Error(data)，其他type也会resolve(data)，然后删除条目。
- message回调收到{type,data}而不是id，this是实例；message与destroy返回undefined。
- commit要求function，只截取toString中大括号内的body，不传闭包/参数。子端用new Function执行。
  匹配resolve(...)时包入Promise(resolve)，否则同步执行并返回response；出错发error后重新抛出。
- static onMessage实际返回Promise，而旧/当前声明为void；commit类型是Promise<ReturnType<T>>，
  保留历史推导，不在本任务随意修正嵌套Promise或callback resolver类型。
- destroy设置destroyed并移除实例监听；未清空promises，也未取消已安排的轮询，具体失败测试由02接续。

## 额外helper是另一代协议

helper使用实例isInject/isDestroy，没有iframe getter或主类的构造/函数参数校验。静态inject设置
isInject/isDestroy，静态destroy会发送destroy包并移除静态监听；收到destroy也会进入相应流程。
其静态onMessage出错发送error但不重新抛出；实例销毁后等待inject的Promise可一直悬挂。
它没有对应独立d.ts；主类声明不能用来证明其类型兼容。

## README、demo与待处理风险

README仅简介/demo/许可证。父demo iframe.js使用新类名、url:'/iframe.html'，commit创建
Artplayer，并由子端static postMessage通知fullscreenWeb；子页面加载两份uncompiled脚本后inject。
当前demo注释提示npm安装tool名，但该名本次registry查询404，分发阶段须处理，不能在此宣称
已完成真实跨源浏览器或npm安装验收。

源码显示Date.now ID可能同毫秒冲突；destroy留下pending请求/轮询；重复inject先发握手再注册。
当前父/子onMessage均未校验event.source/origin，子端接收可执行函数body，发包目标为'*'。
这既是跨窗口信任边界，也是既有协议，须独立设计、取证并记录兼容性决策；不能借TS迁移默默
删除commit、改成另一套RPC、或假称已验证来源隔离。上述生命周期/信任风险均保持open。

运行`node --test refactor/scripts/iframe-contract.test.mjs`：19项覆盖实际主包/legacy、额外helper、
工作区main/legacy/ESM、公开字段、消息包、callback receiver、commit body和resolver返回。
它是可复现的契约基线；真正浏览器、异常时序、销毁/切源及安装类型矩阵由后续任务完成。
