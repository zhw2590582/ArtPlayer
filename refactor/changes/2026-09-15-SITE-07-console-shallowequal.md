# SITE-07 shallowequal 原始署名

修改前 HEAD：0503fe8aa8041da2636601296662b2a6d7a7d533。

shallowequal 1.1.0 的归档 README 明确将 react-pure-render 列为代码来源。
已固定上游 729cdbd51df00068816376544738cc1fc4720cf2 的 shallowEqual.js 和
LICENSE，分别核对 Git blob SHA-1 与内容 SHA-256。保留 Dan Abramov 的完整
2015 MIT 许可，同时继续保留当前包 Alberto Leal 的 2017 MIT 许可。

当前实现增加比较回调、context 和布尔转换，并调整循环和空值判断；不声称它
逐字节等于上游，也不推断原项目安装过某个唯一 react-pure-render 版本。
来源事实和这种区别随 ATTRIBUTION.md 一起交付。这里只新增已引用上游的署名，
没有引入 react-pure-render 运行依赖或修改播放器/控制台实现。

console-derived-attribution.json 增加两个固定 Git 文件，以及已知 npm 归档的
README/index.js 成员指纹；reproduce.ts 在联网和离线模式中校验完整内容，
并确认 README 的来源链接。原有 Git 内容负例测试复用；notice 缺失测试扩展
到该组件，防止清单丢失时仍成功写入。

复核发现新说明对当前包许可的相对链接使用了错误文件名，已改为实际生成的
shallowequal-1.1.0-LICENSE，并增加浏览器断言：两个相对链接都必须指向本轮
已通过 HTTP 逐字节校验的文件，避免只有说明文件可访问而内部链接失效。

控制台现在 44 个组件、47 份 notice；全站 65 份 notice，加索引共 66 个输出。
源码与完整许可保留在 refactor 基线，公开交付完整许可和改动说明。

## 验证

- 单元 25/25，docs-tools 严格类型检查和相关 lint 通过。
- 完整联网复现通过：42 个固定归档、100 个第三方模块、7 个补充 Git 文件，
  Stack Overflow 固定修订及完整许可。没有恢复原项目完整锁文件的声明。
- 三引擎实际页面验证 3/3、零重试/跳过：每个引擎通过 HTTP 逐字节检查
  65 份 notice，含新增文件；同时验证移动控制台、原生播放和销毁。
- [验证记录](../baselines/console-shallowequal-validation.json)保存引擎版本、
  产物指纹及报告诊断。浏览器 scope 为本地 Windows，外部 HTTPS 被隔离；
  不替代真机、真实广告 SDK 或远端发布验证。

VENDOR-08 仍 open：最终混合许可分发审查未完成。SITE-07 仍 doing，其他
Monaco/字体/媒体资产继续处理。源码一致不自动证明整个重构具备发布条件。
回退本批时移除新增署名输出及对应生成/校验配置即可，运行时代码无差异。
本批单独本地提交；没有推送、部署或发布。
