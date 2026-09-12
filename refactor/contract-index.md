# 公开契约覆盖索引

> 由 contract-policy.json 生成；`yarn check:contracts --write` 更新。动态候选/报告状态见 `yarn check:contracts --report`。

覆盖12类兼容契约与22包的验证归属；不是每个公开成员的穷尽测试证明。没有固定测试ID的行仍需逐成员补齐。
版本均为精确冻结对照点，不能推导连续支持区间。历史报告保留原状态，只有精确用例和候选指纹对应时才列为观察结果。

| 包 | 契约 | 责任任务 | 固定测试ID |
| --- | --- | --- | --- |
| artplayer | API-01 构造与配置 | REVIEW-02 | CT-CORE-OPTIONS-001, CT-CORE-OPTIONS-002 |
| artplayer | API-02 属性与方法 | REVIEW-02 | CT-CORE-PLUGINS-002, CT-CORE-STORAGE-001 |
| artplayer | API-03 属性描述符 | REVIEW-02 | CT-CORE-PLUGINS-001 |
| artplayer | API-04 事件 | REVIEW-02 | CT-CORE-EVENTS-001 |
| artplayer | API-05 生命周期 | REVIEW-02 | CT-CORE-PLUGINS-003 |
| artplayer | API-06 插件注册 | REVIEW-02 | CT-CORE-PLUGINS-001, CT-CORE-PLUGINS-002, CT-CORE-PLUGINS-003 |
| artplayer | API-07 生态集成 | REVIEW-02 | 待索引；不代表没有历史测试 |
| artplayer | API-08 DOM/CSS | REVIEW-02 | 待索引；不代表没有历史测试 |
| artplayer | API-09 包分发 | REVIEW-02 | 待索引；不代表没有历史测试 |
| artplayer | API-10 浏览器能力 | REL-03 | 待索引；不代表没有历史测试 |
| artplayer | API-11 TypeScript | REVIEW-02 | 待索引；不代表没有历史测试 |
| artplayer | API-12 持久状态与协议 | REVIEW-02 | CT-CORE-STORAGE-001, CT-CORE-STORAGE-002 |
| artplayer-plugin-ads | API-01 构造与配置 | PKG-ADS-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-ads | API-02 属性与方法 | PKG-ADS-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-ads | API-03 属性描述符 | PKG-ADS-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-ads | API-04 事件 | PKG-ADS-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-ads | API-05 生命周期 | PKG-ADS-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-ads | API-06 插件注册 | PKG-ADS-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-ads | API-07 生态集成 | PKG-ADS-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-ads | API-08 DOM/CSS | PKG-ADS-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-ads | API-09 包分发 | PKG-ADS-06 | 待索引；不代表没有历史测试 |
| artplayer-plugin-ads | API-10 浏览器能力 | REL-03 | 待索引；不代表没有历史测试 |
| artplayer-plugin-ads | API-11 TypeScript | PKG-ADS-04 | 待索引；不代表没有历史测试 |
| artplayer-plugin-ads | API-12 持久状态与协议 | PKG-ADS-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-ambilight | API-01 构造与配置 | PKG-AMBILIGHT-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-ambilight | API-02 属性与方法 | PKG-AMBILIGHT-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-ambilight | API-03 属性描述符 | PKG-AMBILIGHT-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-ambilight | API-04 事件 | PKG-AMBILIGHT-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-ambilight | API-05 生命周期 | PKG-AMBILIGHT-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-ambilight | API-06 插件注册 | PKG-AMBILIGHT-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-ambilight | API-07 生态集成 | PKG-AMBILIGHT-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-ambilight | API-08 DOM/CSS | PKG-AMBILIGHT-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-ambilight | API-09 包分发 | PKG-AMBILIGHT-06 | 待索引；不代表没有历史测试 |
| artplayer-plugin-ambilight | API-10 浏览器能力 | REL-03 | 待索引；不代表没有历史测试 |
| artplayer-plugin-ambilight | API-11 TypeScript | PKG-AMBILIGHT-04 | 待索引；不代表没有历史测试 |
| artplayer-plugin-ambilight | API-12 持久状态与协议 | PKG-AMBILIGHT-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-asr | API-01 构造与配置 | PKG-ASR-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-asr | API-02 属性与方法 | PKG-ASR-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-asr | API-03 属性描述符 | PKG-ASR-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-asr | API-04 事件 | PKG-ASR-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-asr | API-05 生命周期 | PKG-ASR-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-asr | API-06 插件注册 | PKG-ASR-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-asr | API-07 生态集成 | PKG-ASR-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-asr | API-08 DOM/CSS | PKG-ASR-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-asr | API-09 包分发 | PKG-ASR-06 | 待索引；不代表没有历史测试 |
| artplayer-plugin-asr | API-10 浏览器能力 | REL-03 | 待索引；不代表没有历史测试 |
| artplayer-plugin-asr | API-11 TypeScript | PKG-ASR-04 | 待索引；不代表没有历史测试 |
| artplayer-plugin-asr | API-12 持久状态与协议 | PKG-ASR-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-audio-track | API-01 构造与配置 | PKG-AUDIO-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-audio-track | API-02 属性与方法 | PKG-AUDIO-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-audio-track | API-03 属性描述符 | PKG-AUDIO-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-audio-track | API-04 事件 | PKG-AUDIO-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-audio-track | API-05 生命周期 | PKG-AUDIO-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-audio-track | API-06 插件注册 | PKG-AUDIO-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-audio-track | API-07 生态集成 | PKG-AUDIO-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-audio-track | API-08 DOM/CSS | PKG-AUDIO-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-audio-track | API-09 包分发 | PKG-AUDIO-06 | 待索引；不代表没有历史测试 |
| artplayer-plugin-audio-track | API-10 浏览器能力 | REL-03 | 待索引；不代表没有历史测试 |
| artplayer-plugin-audio-track | API-11 TypeScript | PKG-AUDIO-04 | 待索引；不代表没有历史测试 |
| artplayer-plugin-audio-track | API-12 持久状态与协议 | PKG-AUDIO-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-auto-thumbnail | API-01 构造与配置 | PKG-AUTO-THUMB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-auto-thumbnail | API-02 属性与方法 | PKG-AUTO-THUMB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-auto-thumbnail | API-03 属性描述符 | PKG-AUTO-THUMB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-auto-thumbnail | API-04 事件 | PKG-AUTO-THUMB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-auto-thumbnail | API-05 生命周期 | PKG-AUTO-THUMB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-auto-thumbnail | API-06 插件注册 | PKG-AUTO-THUMB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-auto-thumbnail | API-07 生态集成 | PKG-AUTO-THUMB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-auto-thumbnail | API-08 DOM/CSS | PKG-AUTO-THUMB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-auto-thumbnail | API-09 包分发 | PKG-AUTO-THUMB-06 | 待索引；不代表没有历史测试 |
| artplayer-plugin-auto-thumbnail | API-10 浏览器能力 | REL-03 | 待索引；不代表没有历史测试 |
| artplayer-plugin-auto-thumbnail | API-11 TypeScript | PKG-AUTO-THUMB-04 | 待索引；不代表没有历史测试 |
| artplayer-plugin-auto-thumbnail | API-12 持久状态与协议 | PKG-AUTO-THUMB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-chapter | API-01 构造与配置 | PKG-CHAPTER-02 | CT-CHAPTER-NORMALIZE-001 |
| artplayer-plugin-chapter | API-02 属性与方法 | PKG-CHAPTER-02 | CT-CHAPTER-NORMALIZE-001, CT-CHAPTER-NORMALIZE-002 |
| artplayer-plugin-chapter | API-03 属性描述符 | PKG-CHAPTER-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-chapter | API-04 事件 | PKG-CHAPTER-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-chapter | API-05 生命周期 | PKG-CHAPTER-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-chapter | API-06 插件注册 | PKG-CHAPTER-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-chapter | API-07 生态集成 | PKG-CHAPTER-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-chapter | API-08 DOM/CSS | PKG-CHAPTER-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-chapter | API-09 包分发 | PKG-CHAPTER-06 | 待索引；不代表没有历史测试 |
| artplayer-plugin-chapter | API-10 浏览器能力 | REL-03 | 待索引；不代表没有历史测试 |
| artplayer-plugin-chapter | API-11 TypeScript | PKG-CHAPTER-04 | 待索引；不代表没有历史测试 |
| artplayer-plugin-chapter | API-12 持久状态与协议 | PKG-CHAPTER-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-chromecast | API-01 构造与配置 | PKG-CAST-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-chromecast | API-02 属性与方法 | PKG-CAST-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-chromecast | API-03 属性描述符 | PKG-CAST-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-chromecast | API-04 事件 | PKG-CAST-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-chromecast | API-05 生命周期 | PKG-CAST-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-chromecast | API-06 插件注册 | PKG-CAST-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-chromecast | API-07 生态集成 | PKG-CAST-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-chromecast | API-08 DOM/CSS | PKG-CAST-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-chromecast | API-09 包分发 | PKG-CAST-06 | 待索引；不代表没有历史测试 |
| artplayer-plugin-chromecast | API-10 浏览器能力 | REL-03 | 待索引；不代表没有历史测试 |
| artplayer-plugin-chromecast | API-11 TypeScript | PKG-CAST-04 | 待索引；不代表没有历史测试 |
| artplayer-plugin-chromecast | API-12 持久状态与协议 | PKG-CAST-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-danmuku | API-01 构造与配置 | PKG-DANMUKU-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-danmuku | API-02 属性与方法 | PKG-DANMUKU-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-danmuku | API-03 属性描述符 | PKG-DANMUKU-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-danmuku | API-04 事件 | PKG-DANMUKU-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-danmuku | API-05 生命周期 | PKG-DANMUKU-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-danmuku | API-06 插件注册 | PKG-DANMUKU-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-danmuku | API-07 生态集成 | PKG-DANMUKU-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-danmuku | API-08 DOM/CSS | PKG-DANMUKU-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-danmuku | API-09 包分发 | PKG-DANMUKU-06 | 待索引；不代表没有历史测试 |
| artplayer-plugin-danmuku | API-10 浏览器能力 | REL-03 | 待索引；不代表没有历史测试 |
| artplayer-plugin-danmuku | API-11 TypeScript | PKG-DANMUKU-04 | 待索引；不代表没有历史测试 |
| artplayer-plugin-danmuku | API-12 持久状态与协议 | PKG-DANMUKU-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-danmuku-mask | API-01 构造与配置 | PKG-MASK-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-danmuku-mask | API-02 属性与方法 | PKG-MASK-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-danmuku-mask | API-03 属性描述符 | PKG-MASK-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-danmuku-mask | API-04 事件 | PKG-MASK-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-danmuku-mask | API-05 生命周期 | PKG-MASK-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-danmuku-mask | API-06 插件注册 | PKG-MASK-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-danmuku-mask | API-07 生态集成 | PKG-MASK-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-danmuku-mask | API-08 DOM/CSS | PKG-MASK-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-danmuku-mask | API-09 包分发 | PKG-MASK-06 | 待索引；不代表没有历史测试 |
| artplayer-plugin-danmuku-mask | API-10 浏览器能力 | REL-03 | 待索引；不代表没有历史测试 |
| artplayer-plugin-danmuku-mask | API-11 TypeScript | PKG-MASK-04 | 待索引；不代表没有历史测试 |
| artplayer-plugin-danmuku-mask | API-12 持久状态与协议 | PKG-MASK-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-dash-control | API-01 构造与配置 | PKG-DASH-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-dash-control | API-02 属性与方法 | PKG-DASH-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-dash-control | API-03 属性描述符 | PKG-DASH-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-dash-control | API-04 事件 | PKG-DASH-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-dash-control | API-05 生命周期 | PKG-DASH-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-dash-control | API-06 插件注册 | PKG-DASH-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-dash-control | API-07 生态集成 | PKG-DASH-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-dash-control | API-08 DOM/CSS | PKG-DASH-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-dash-control | API-09 包分发 | PKG-DASH-06 | 待索引；不代表没有历史测试 |
| artplayer-plugin-dash-control | API-10 浏览器能力 | REL-03 | 待索引；不代表没有历史测试 |
| artplayer-plugin-dash-control | API-11 TypeScript | PKG-DASH-04 | 待索引；不代表没有历史测试 |
| artplayer-plugin-dash-control | API-12 持久状态与协议 | PKG-DASH-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-document-pip | API-01 构造与配置 | PKG-DPIP-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-document-pip | API-02 属性与方法 | PKG-DPIP-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-document-pip | API-03 属性描述符 | PKG-DPIP-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-document-pip | API-04 事件 | PKG-DPIP-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-document-pip | API-05 生命周期 | PKG-DPIP-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-document-pip | API-06 插件注册 | PKG-DPIP-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-document-pip | API-07 生态集成 | PKG-DPIP-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-document-pip | API-08 DOM/CSS | PKG-DPIP-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-document-pip | API-09 包分发 | PKG-DPIP-06 | 待索引；不代表没有历史测试 |
| artplayer-plugin-document-pip | API-10 浏览器能力 | REL-03 | 待索引；不代表没有历史测试 |
| artplayer-plugin-document-pip | API-11 TypeScript | PKG-DPIP-04 | 待索引；不代表没有历史测试 |
| artplayer-plugin-document-pip | API-12 持久状态与协议 | PKG-DPIP-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-hls-control | API-01 构造与配置 | PKG-HLS-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-hls-control | API-02 属性与方法 | PKG-HLS-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-hls-control | API-03 属性描述符 | PKG-HLS-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-hls-control | API-04 事件 | PKG-HLS-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-hls-control | API-05 生命周期 | PKG-HLS-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-hls-control | API-06 插件注册 | PKG-HLS-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-hls-control | API-07 生态集成 | PKG-HLS-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-hls-control | API-08 DOM/CSS | PKG-HLS-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-hls-control | API-09 包分发 | PKG-HLS-06 | 待索引；不代表没有历史测试 |
| artplayer-plugin-hls-control | API-10 浏览器能力 | REL-03 | 待索引；不代表没有历史测试 |
| artplayer-plugin-hls-control | API-11 TypeScript | PKG-HLS-04 | 待索引；不代表没有历史测试 |
| artplayer-plugin-hls-control | API-12 持久状态与协议 | PKG-HLS-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-jassub | API-01 构造与配置 | PKG-JASSUB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-jassub | API-02 属性与方法 | PKG-JASSUB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-jassub | API-03 属性描述符 | PKG-JASSUB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-jassub | API-04 事件 | PKG-JASSUB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-jassub | API-05 生命周期 | PKG-JASSUB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-jassub | API-06 插件注册 | PKG-JASSUB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-jassub | API-07 生态集成 | PKG-JASSUB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-jassub | API-08 DOM/CSS | PKG-JASSUB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-jassub | API-09 包分发 | PKG-JASSUB-06 | 待索引；不代表没有历史测试 |
| artplayer-plugin-jassub | API-10 浏览器能力 | REL-03 | 待索引；不代表没有历史测试 |
| artplayer-plugin-jassub | API-11 TypeScript | PKG-JASSUB-04 | 待索引；不代表没有历史测试 |
| artplayer-plugin-jassub | API-12 持久状态与协议 | PKG-JASSUB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-multiple-subtitles | API-01 构造与配置 | PKG-MULTI-SUB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-multiple-subtitles | API-02 属性与方法 | PKG-MULTI-SUB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-multiple-subtitles | API-03 属性描述符 | PKG-MULTI-SUB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-multiple-subtitles | API-04 事件 | PKG-MULTI-SUB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-multiple-subtitles | API-05 生命周期 | PKG-MULTI-SUB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-multiple-subtitles | API-06 插件注册 | PKG-MULTI-SUB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-multiple-subtitles | API-07 生态集成 | PKG-MULTI-SUB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-multiple-subtitles | API-08 DOM/CSS | PKG-MULTI-SUB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-multiple-subtitles | API-09 包分发 | PKG-MULTI-SUB-06 | 待索引；不代表没有历史测试 |
| artplayer-plugin-multiple-subtitles | API-10 浏览器能力 | REL-03 | 待索引；不代表没有历史测试 |
| artplayer-plugin-multiple-subtitles | API-11 TypeScript | PKG-MULTI-SUB-04 | 待索引；不代表没有历史测试 |
| artplayer-plugin-multiple-subtitles | API-12 持久状态与协议 | PKG-MULTI-SUB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-vast | API-01 构造与配置 | PKG-VAST-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-vast | API-02 属性与方法 | PKG-VAST-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-vast | API-03 属性描述符 | PKG-VAST-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-vast | API-04 事件 | PKG-VAST-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-vast | API-05 生命周期 | PKG-VAST-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-vast | API-06 插件注册 | PKG-VAST-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-vast | API-07 生态集成 | PKG-VAST-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-vast | API-08 DOM/CSS | PKG-VAST-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-vast | API-09 包分发 | PKG-VAST-06 | 待索引；不代表没有历史测试 |
| artplayer-plugin-vast | API-10 浏览器能力 | REL-03 | 待索引；不代表没有历史测试 |
| artplayer-plugin-vast | API-11 TypeScript | PKG-VAST-04 | 待索引；不代表没有历史测试 |
| artplayer-plugin-vast | API-12 持久状态与协议 | PKG-VAST-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-vtt-thumbnail | API-01 构造与配置 | PKG-VTT-THUMB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-vtt-thumbnail | API-02 属性与方法 | PKG-VTT-THUMB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-vtt-thumbnail | API-03 属性描述符 | PKG-VTT-THUMB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-vtt-thumbnail | API-04 事件 | PKG-VTT-THUMB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-vtt-thumbnail | API-05 生命周期 | PKG-VTT-THUMB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-vtt-thumbnail | API-06 插件注册 | PKG-VTT-THUMB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-vtt-thumbnail | API-07 生态集成 | PKG-VTT-THUMB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-vtt-thumbnail | API-08 DOM/CSS | PKG-VTT-THUMB-02 | 待索引；不代表没有历史测试 |
| artplayer-plugin-vtt-thumbnail | API-09 包分发 | PKG-VTT-THUMB-06 | 待索引；不代表没有历史测试 |
| artplayer-plugin-vtt-thumbnail | API-10 浏览器能力 | REL-03 | 待索引；不代表没有历史测试 |
| artplayer-plugin-vtt-thumbnail | API-11 TypeScript | PKG-VTT-THUMB-04 | 待索引；不代表没有历史测试 |
| artplayer-plugin-vtt-thumbnail | API-12 持久状态与协议 | PKG-VTT-THUMB-02 | 待索引；不代表没有历史测试 |
| artplayer-proxy-canvas | API-01 构造与配置 | PKG-CANVAS-02 | 待索引；不代表没有历史测试 |
| artplayer-proxy-canvas | API-02 属性与方法 | PKG-CANVAS-02 | 待索引；不代表没有历史测试 |
| artplayer-proxy-canvas | API-03 属性描述符 | PKG-CANVAS-02 | 待索引；不代表没有历史测试 |
| artplayer-proxy-canvas | API-04 事件 | PKG-CANVAS-02 | 待索引；不代表没有历史测试 |
| artplayer-proxy-canvas | API-05 生命周期 | PKG-CANVAS-02 | 待索引；不代表没有历史测试 |
| artplayer-proxy-canvas | API-06 插件注册 | PKG-CANVAS-02 | 待索引；不代表没有历史测试 |
| artplayer-proxy-canvas | API-07 生态集成 | PKG-CANVAS-02 | 待索引；不代表没有历史测试 |
| artplayer-proxy-canvas | API-08 DOM/CSS | PKG-CANVAS-02 | 待索引；不代表没有历史测试 |
| artplayer-proxy-canvas | API-09 包分发 | PKG-CANVAS-06 | 待索引；不代表没有历史测试 |
| artplayer-proxy-canvas | API-10 浏览器能力 | REL-03 | 待索引；不代表没有历史测试 |
| artplayer-proxy-canvas | API-11 TypeScript | PKG-CANVAS-04 | 待索引；不代表没有历史测试 |
| artplayer-proxy-canvas | API-12 持久状态与协议 | PKG-CANVAS-02 | 待索引；不代表没有历史测试 |
| artplayer-proxy-mediabunny | API-01 构造与配置 | PKG-MB-02 | 待索引；不代表没有历史测试 |
| artplayer-proxy-mediabunny | API-02 属性与方法 | PKG-MB-02 | 待索引；不代表没有历史测试 |
| artplayer-proxy-mediabunny | API-03 属性描述符 | PKG-MB-02 | 待索引；不代表没有历史测试 |
| artplayer-proxy-mediabunny | API-04 事件 | PKG-MB-02 | 待索引；不代表没有历史测试 |
| artplayer-proxy-mediabunny | API-05 生命周期 | PKG-MB-02 | 待索引；不代表没有历史测试 |
| artplayer-proxy-mediabunny | API-06 插件注册 | PKG-MB-02 | 待索引；不代表没有历史测试 |
| artplayer-proxy-mediabunny | API-07 生态集成 | PKG-MB-02 | 待索引；不代表没有历史测试 |
| artplayer-proxy-mediabunny | API-08 DOM/CSS | PKG-MB-02 | 待索引；不代表没有历史测试 |
| artplayer-proxy-mediabunny | API-09 包分发 | PKG-MB-10 | 待索引；不代表没有历史测试 |
| artplayer-proxy-mediabunny | API-10 浏览器能力 | REL-03 | 待索引；不代表没有历史测试 |
| artplayer-proxy-mediabunny | API-11 TypeScript | PKG-MB-08 | 待索引；不代表没有历史测试 |
| artplayer-proxy-mediabunny | API-12 持久状态与协议 | PKG-MB-02 | 待索引；不代表没有历史测试 |
| artplayer-tool-iframe | API-01 构造与配置 | PKG-IFRAME-02 | 待索引；不代表没有历史测试 |
| artplayer-tool-iframe | API-02 属性与方法 | PKG-IFRAME-02 | 待索引；不代表没有历史测试 |
| artplayer-tool-iframe | API-03 属性描述符 | PKG-IFRAME-02 | 待索引；不代表没有历史测试 |
| artplayer-tool-iframe | API-04 事件 | PKG-IFRAME-02 | 待索引；不代表没有历史测试 |
| artplayer-tool-iframe | API-05 生命周期 | PKG-IFRAME-02 | 待索引；不代表没有历史测试 |
| artplayer-tool-iframe | API-06 插件注册 | PKG-IFRAME-02 | 待索引；不代表没有历史测试 |
| artplayer-tool-iframe | API-07 生态集成 | PKG-IFRAME-02 | 待索引；不代表没有历史测试 |
| artplayer-tool-iframe | API-08 DOM/CSS | PKG-IFRAME-02 | 待索引；不代表没有历史测试 |
| artplayer-tool-iframe | API-09 包分发 | PKG-IFRAME-06 | 待索引；不代表没有历史测试 |
| artplayer-tool-iframe | API-10 浏览器能力 | REL-03 | 待索引；不代表没有历史测试 |
| artplayer-tool-iframe | API-11 TypeScript | PKG-IFRAME-04 | 待索引；不代表没有历史测试 |
| artplayer-tool-iframe | API-12 持久状态与协议 | PKG-IFRAME-02 | 待索引；不代表没有历史测试 |
| artplayer-tool-thumbnail | API-01 构造与配置 | PKG-TOOL-THUMB-02 | 待索引；不代表没有历史测试 |
| artplayer-tool-thumbnail | API-02 属性与方法 | PKG-TOOL-THUMB-02 | 待索引；不代表没有历史测试 |
| artplayer-tool-thumbnail | API-03 属性描述符 | PKG-TOOL-THUMB-02 | 待索引；不代表没有历史测试 |
| artplayer-tool-thumbnail | API-04 事件 | PKG-TOOL-THUMB-02 | 待索引；不代表没有历史测试 |
| artplayer-tool-thumbnail | API-05 生命周期 | PKG-TOOL-THUMB-02 | 待索引；不代表没有历史测试 |
| artplayer-tool-thumbnail | API-06 插件注册 | PKG-TOOL-THUMB-02 | 待索引；不代表没有历史测试 |
| artplayer-tool-thumbnail | API-07 生态集成 | PKG-TOOL-THUMB-02 | 待索引；不代表没有历史测试 |
| artplayer-tool-thumbnail | API-08 DOM/CSS | PKG-TOOL-THUMB-02 | 待索引；不代表没有历史测试 |
| artplayer-tool-thumbnail | API-09 包分发 | PKG-TOOL-THUMB-06 | 待索引；不代表没有历史测试 |
| artplayer-tool-thumbnail | API-10 浏览器能力 | REL-03 | 待索引；不代表没有历史测试 |
| artplayer-tool-thumbnail | API-11 TypeScript | PKG-TOOL-THUMB-04 | 待索引；不代表没有历史测试 |
| artplayer-tool-thumbnail | API-12 持久状态与协议 | PKG-TOOL-THUMB-02 | 待索引；不代表没有历史测试 |
| artplayer-vitepress | API-01 构造与配置 | SITE-06 | 待索引；不代表没有历史测试 |
| artplayer-vitepress | API-02 属性与方法 | SITE-06 | 待索引；不代表没有历史测试 |
| artplayer-vitepress | API-03 属性描述符 | SITE-06 | 待索引；不代表没有历史测试 |
| artplayer-vitepress | API-04 事件 | SITE-06 | 待索引；不代表没有历史测试 |
| artplayer-vitepress | API-05 生命周期 | SITE-06 | 待索引；不代表没有历史测试 |
| artplayer-vitepress | API-06 插件注册 | SITE-06 | 待索引；不代表没有历史测试 |
| artplayer-vitepress | API-07 生态集成 | SITE-06 | 待索引；不代表没有历史测试 |
| artplayer-vitepress | API-08 DOM/CSS | SITE-06 | 待索引；不代表没有历史测试 |
| artplayer-vitepress | API-09 包分发 | SITE-06 | 待索引；不代表没有历史测试 |
| artplayer-vitepress | API-10 浏览器能力 | SITE-06 | 待索引；不代表没有历史测试 |
| artplayer-vitepress | API-11 TypeScript | SITE-06 | 待索引；不代表没有历史测试 |
| artplayer-vitepress | API-12 持久状态与协议 | SITE-06 | 待索引；不代表没有历史测试 |

## 精确测试及限制

- CT-CORE-OPTIONS-001: [test/options.test.js](../test/options.test.js) — default values, keys and nested order match the published getter。Current option getter compared with archived published 5.4.0。限制：Source/controlled-host assertions only; no whole-family acceptance, installed tarball, browser, device or continuous support-range claim。命令：`yarn test:contracts`。版本依据：WS-artplayer, PUB-artplayer-5.4.0。
- CT-CORE-OPTIONS-002: [test/options.test.js](../test/options.test.js) — invalid JS input keeps the published validation path, first error and thrown kind。Nine invalid input patches compare first error name/message with published 5.4.0。限制：Source/controlled-host assertions only; no whole-family acceptance, installed tarball, browser, device or continuous support-range claim。命令：`yarn test:contracts`。版本依据：WS-artplayer, PUB-artplayer-5.4.0。
- CT-CORE-PLUGINS-001: [test/plugins.test.js](../test/plugins.test.js) — plugin registration keeps receiver, arguments, id, descriptors and naming precedence。Controlled registry checks receiver, identity, hidden nonwritable descriptor and naming conflicts。限制：Source/controlled-host assertions only; no whole-family acceptance, installed tarball, browser, device or continuous support-range claim。命令：`yarn test:contracts`。版本依据：WS-artplayer。
- CT-CORE-PLUGINS-002: [test/plugins.test.js](../test/plugins.test.js) — async factories preserve pending visibility, completion-time fallback and registry fulfillment。Controlled asynchronous factory visibility and returned registry。限制：Source/controlled-host assertions only; no whole-family acceptance, installed tarball, browser, device or continuous support-range claim。命令：`yarn test:contracts`。版本依据：WS-artplayer。
- CT-CORE-PLUGINS-003: [test/plugins.test.js](../test/plugins.test.js) — closed registries ignore late results without inspecting or destroying them and reject new factories。Disposed scope suppresses late result getters and disallows further factory execution。限制：Source/controlled-host assertions only; no whole-family acceptance, installed tarball, browser, device or continuous support-range claim。命令：`yarn test:contracts`。版本依据：WS-artplayer。
- CT-CORE-EVENTS-001: [test/public-behavior.test.js](../test/public-behavior.test.js) — EVENT.once-nested-snapshot: candidate consumes a once registration across nested dispatch snapshots。Published duplicate nested once dispatch is reproduced; current consumes once exactly once。限制：Source/controlled-host assertions only; no whole-family acceptance, installed tarball, browser, device or continuous support-range claim。命令：`yarn test:contracts`。版本依据：WS-artplayer, PUB-artplayer-5.4.0。
- CT-CORE-STORAGE-001: [test/storage.test.js](../test/storage.test.js) — storage preserves envelope, mutable name/settings fields and synchronous returns。Controlled localStorage verifies exact key/envelope and synchronous returns。限制：Source/controlled-host assertions only; no whole-family acceptance, installed tarball, browser, device or continuous support-range claim。命令：`yarn test:contracts`。版本依据：WS-artplayer。
- CT-CORE-STORAGE-002: [test/storage.test.js](../test/storage.test.js) — storage retains truthy key selection and historical JSON payload shapes。Array/scalar/null/malformed JSON cases retain historical fallback semantics。限制：Source/controlled-host assertions only; no whole-family acceptance, installed tarball, browser, device or continuous support-range claim。命令：`yarn test:contracts`。版本依据：WS-artplayer。
- CT-CHAPTER-NORMALIZE-001: [test/chapter.test.js](../test/chapter.test.js) — Chapter normalization preserves caller array and objects while filling every gap。Current normalizer retains caller array and chapter identity across repeated normalization。限制：Source/controlled-host assertions only; no whole-family acceptance, installed tarball, browser, device or continuous support-range claim。命令：`yarn test:contracts`。版本依据：WS-artplayer-plugin-chapter。
- CT-CHAPTER-NORMALIZE-002: [test/chapter.test.js](../test/chapter.test.js) — Chapter endpoints, adjacency and Infinity normalization retain historical behavior。Current normalizer retains adjacent endpoints and resolves Infinity against duration。限制：Source/controlled-host assertions only; no whole-family acceptance, installed tarball, browser, device or continuous support-range claim。命令：`yarn test:contracts`。版本依据：WS-artplayer-plugin-chapter。

## 版本依据

- WS-artplayer: artplayer@5.4.1 (workspace-baseline)；[来源](../refactor/package-inventory.json) JSON pointer `/packages/0`。
- WS-artplayer-plugin-ads: artplayer-plugin-ads@2.1.0 (workspace-baseline)；[来源](../refactor/package-inventory.json) JSON pointer `/packages/1`。
- WS-artplayer-plugin-ambilight: artplayer-plugin-ambilight@1.1.0 (workspace-baseline)；[来源](../refactor/package-inventory.json) JSON pointer `/packages/2`。
- WS-artplayer-plugin-asr: artplayer-plugin-asr@2.1.0 (workspace-baseline)；[来源](../refactor/package-inventory.json) JSON pointer `/packages/3`。
- WS-artplayer-plugin-audio-track: artplayer-plugin-audio-track@1.1.0 (workspace-baseline)；[来源](../refactor/package-inventory.json) JSON pointer `/packages/4`。
- WS-artplayer-plugin-auto-thumbnail: artplayer-plugin-auto-thumbnail@1.1.0 (workspace-baseline)；[来源](../refactor/package-inventory.json) JSON pointer `/packages/5`。
- WS-artplayer-plugin-chapter: artplayer-plugin-chapter@1.1.0 (workspace-baseline)；[来源](../refactor/package-inventory.json) JSON pointer `/packages/6`。
- WS-artplayer-plugin-chromecast: artplayer-plugin-chromecast@1.1.0 (workspace-baseline)；[来源](../refactor/package-inventory.json) JSON pointer `/packages/7`。
- WS-artplayer-plugin-danmuku: artplayer-plugin-danmuku@5.3.0 (workspace-baseline)；[来源](../refactor/package-inventory.json) JSON pointer `/packages/8`。
- WS-artplayer-plugin-danmuku-mask: artplayer-plugin-danmuku-mask@1.1.0 (workspace-baseline)；[来源](../refactor/package-inventory.json) JSON pointer `/packages/9`。
- WS-artplayer-plugin-dash-control: artplayer-plugin-dash-control@1.1.0 (workspace-baseline)；[来源](../refactor/package-inventory.json) JSON pointer `/packages/10`。
- WS-artplayer-plugin-document-pip: artplayer-plugin-document-pip@1.1.0 (workspace-baseline)；[来源](../refactor/package-inventory.json) JSON pointer `/packages/11`。
- WS-artplayer-plugin-hls-control: artplayer-plugin-hls-control@1.1.0 (workspace-baseline)；[来源](../refactor/package-inventory.json) JSON pointer `/packages/12`。
- WS-artplayer-plugin-jassub: artplayer-plugin-jassub@1.1.0 (workspace-baseline)；[来源](../refactor/package-inventory.json) JSON pointer `/packages/13`。
- WS-artplayer-plugin-multiple-subtitles: artplayer-plugin-multiple-subtitles@1.2.0 (workspace-baseline)；[来源](../refactor/package-inventory.json) JSON pointer `/packages/14`。
- WS-artplayer-plugin-vast: artplayer-plugin-vast@1.2.0 (workspace-baseline)；[来源](../refactor/package-inventory.json) JSON pointer `/packages/15`。
- WS-artplayer-plugin-vtt-thumbnail: artplayer-plugin-vtt-thumbnail@1.1.0 (workspace-baseline)；[来源](../refactor/package-inventory.json) JSON pointer `/packages/16`。
- WS-artplayer-proxy-canvas: artplayer-proxy-canvas@1.1.0 (workspace-baseline)；[来源](../refactor/package-inventory.json) JSON pointer `/packages/17`。
- WS-artplayer-proxy-mediabunny: artplayer-proxy-mediabunny@1.2.0 (workspace-baseline)；[来源](../refactor/package-inventory.json) JSON pointer `/packages/18`。
- WS-artplayer-tool-iframe: artplayer-tool-iframe@1.1.0 (workspace-baseline)；[来源](../refactor/package-inventory.json) JSON pointer `/packages/19`。
- WS-artplayer-tool-thumbnail: artplayer-tool-thumbnail@4.4.0 (workspace-baseline)；[来源](../refactor/package-inventory.json) JSON pointer `/packages/20`。
- WS-artplayer-vitepress: artplayer-vitepress@1.1.0 (workspace-baseline)；[来源](../refactor/package-inventory.json) JSON pointer `/packages/21`。
- PUB-artplayer-5.4.0: artplayer@5.4.0 (published-baseline)；[来源](../refactor/baselines/releases.json) JSON pointer `/releases/0`。
- PUB-artplayer-plugin-chapter-1.1.0: artplayer-plugin-chapter@1.1.0 (published-baseline)；[来源](../refactor/baselines/releases.json) JSON pointer `/releases/1`。
- PUB-artplayer-plugin-audio-track-1.1.0: artplayer-plugin-audio-track@1.1.0 (published-baseline)；[来源](../refactor/baselines/audio-track-release.json) JSON pointer `/release`。
- PUB-artplayer-plugin-hls-control-1.1.0: artplayer-plugin-hls-control@1.1.0 (published-baseline)；[来源](../refactor/baselines/hls-control-release.json) JSON pointer `/release`。
- PUB-artplayer-plugin-dash-control-1.1.0: artplayer-plugin-dash-control@1.1.0 (published-baseline)；[来源](../refactor/baselines/dash-control-release.json) JSON pointer `/release`。
- PUB-artplayer-plugin-ads-1.0.6: artplayer-plugin-ads@1.0.6 (published-baseline)；[来源](../refactor/baselines/ads-release.json) JSON pointer `/release`。
- PUB-artplayer-plugin-vast-1.0.0: artplayer-plugin-vast@1.0.0 (published-baseline)；[来源](../refactor/baselines/vast-release.json) JSON pointer `/release`。
- PUB-artplayer-plugin-ambilight-1.1.0: artplayer-plugin-ambilight@1.1.0 (published-baseline)；[来源](../refactor/baselines/ambilight-release.json) JSON pointer `/release`。
- PUB-artplayer-plugin-ambilight-1.0.0: artplayer-plugin-ambilight@1.0.0 (published-baseline)；[来源](../refactor/baselines/ambilight-release.json) JSON pointer `/previous/0`。
- PUB-artplayer-proxy-canvas-1.1.0: artplayer-proxy-canvas@1.1.0 (published-baseline)；[来源](../refactor/baselines/canvas-release.json) JSON pointer `/release`。
- PUB-artplayer-proxy-canvas-1.0.0: artplayer-proxy-canvas@1.0.0 (published-baseline)；[来源](../refactor/baselines/canvas-release.json) JSON pointer `/previous/0`。
- PUB-artplayer-plugin-document-pip-1.1.0: artplayer-plugin-document-pip@1.1.0 (published-baseline)；[来源](../refactor/baselines/dpip-release.json) JSON pointer `/release`。
- PUB-artplayer-plugin-document-pip-1.0.2: artplayer-plugin-document-pip@1.0.2 (published-baseline)；[来源](../refactor/baselines/dpip-release.json) JSON pointer `/previous/0`。
- PUB-artplayer-plugin-document-pip-1.0.1: artplayer-plugin-document-pip@1.0.1 (published-baseline)；[来源](../refactor/baselines/dpip-release.json) JSON pointer `/previous/1`。
- PUB-artplayer-plugin-document-pip-1.0.0: artplayer-plugin-document-pip@1.0.0 (published-baseline)；[来源](../refactor/baselines/dpip-release.json) JSON pointer `/previous/2`。
