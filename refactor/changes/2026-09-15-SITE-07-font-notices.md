# SITE-07 选定字体的完整通知与来源差异

基线 `01f3d00e4c20ff39ce0e5e7db885cee15fd820ee`。本次为SITE-07检查点，
任务继续doing，VENDOR-05/BASE-MEDIA-01继续open。没有改字体二进制、URL、
family、字幕样式、播放器、worker或公开类型，不宣称全部字体已具备发布依据。

## 实际来源与差异

| 字体 | 固定参考 | 本地比较 |
| --- | --- | --- |
| CHAWP | 作者AWP仓库3c4f6317的chawp.otf和完整LICENSE | 字节完全一致 |
| Liberation Sans | 官方2.00.5 release附件、LICENSE；标签24ea9469 | 两个本地woff2副本相同；与TTF字形、映射、宽度一致，FFTM/glyf/head/loca/post有差异 |
| Averia Sans Libre Light | Google Fonts 0f81bc90的1.002与完整OFL | 字形、映射、宽度一致，保留实际字体表差异 |
| Lato Regular | Google Fonts f3b885d5的2.015与完整OFL | 字形、映射、宽度一致，OS/2/head/name不同 |

CHAWP作者页面链接回该仓库。Google参考字体和许可证来自精确commit的contents
API，解码base64为原始字节后计算SHA-256/Git blob；Liberation附件从官方release
正文取得并固定完整归档SHA-256，再只读取指定成员。raw.githubusercontent.com
部分请求失败，改用GitHub官方API成功；没有把错误HTML当作字体或使用不明镜像。

所有原许可证完整保留；Lato参考OFL中的2010–2014与字体内嵌2011–2015版权
分别照录。不能把参考与本地字形一致写成“原始字体/转换配方已完整恢复”。
这些完整通知是现有内嵌声明的补充，不替代原始获取与再分发条件的完整审查。

Averia Serif Simple Light 与参考Serif Libre的编码字符g字形/宽度不同；该文件
不进入已绑定的四字体通知组，差分作为负对照保留。Allison、Architext、Arial、
Franklin Gothic、Garamond、Slate Pro六份再分发依据仍缺，已向用户询问授权来源，
不等待该回复来完成独立通知工作，也没有擅自替换字体。

## 模块与生成

新增fonts/notices.ts，把五个实际字体路径、四份完整许可和一份署名/差异说明
绑定到独立provenance记录。正常build/check:site-notices先验证所有字节/关联，
再生成docs/licenses/jassub-fonts及总索引；总输出96份（95个通知文件加索引）。
错误套用另一字体的许可，即使通用清单生成器能接受，也被专用绑定检查拒绝。
遗漏说明、扩大到未审查Arial等同样失败。Git属性保留原通知字节与换行。

site-font-comparison.py是只读复验器，固定现有fonttools4.60.1/brotli1.1.0，
先核验输入哈希，再逐表、逐字形及metrics/cmap比对；--check核对完整记录和
Serif负对照。Python3.12.14及缓存的字体检查依赖复用既有环境；没有新增根依赖
或锁文件。普通CI只需Node，不调用Python或联网下载参考字体。

## 验证和限制

通知生成/只读检查、15项通知测试、严格docs-tools TS、定向lint和字体复验通过。
三引擎6/6浏览器检查通过，零跳过/重试：完整通知HTTP字节/相对链接、原字体
HTTP SHA-256、FontFace加载及实际画布墨迹、原移动页播放/控制台/销毁均验证。
这是原生字体加载证据，不是完整libass字幕塑形或所有字体的视觉等价验收。

完整来源、表差异和排除项见[来源记录](../baselines/site-font-notices-provenance.json)，
运行报告和指纹见[验证记录](../baselines/site-font-notices-validation.json)。维护文档
同步scripts/site-vendor/fonts/README、站点vendor指南及JASSUB架构。
其他字体、媒体、Monaco来源、设备、远端CI与发布复盘继续保留原门槛。

## 回退

回退本检查点并重新生成通知，可移除本次附加许可组和校验器；字体运行字节
始终未变，消费者无需迁移。本地提交，不推送、部署或发布。
