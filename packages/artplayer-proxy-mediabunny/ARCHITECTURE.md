# Architecture Documentation

## 文件结构

```
src/
├── index.js              # 主入口，创建canvas代理
├── VideoShim.js          # HTMLVideoElement接口模拟层
├── MediaBunnyEngine.js   # 主引擎，协调音视频播放
├── AudioEngine.js        # 音频引擎，处理音频播放
├── VideoEngine.js        # 视频引擎，处理视频帧渲染
└── EventTarget.js        # 事件系统实现
```

## 架构设计

### 层次结构

```
ArtPlayer
    ↓
index.js (Canvas Proxy)
    ↓
VideoShim (HTMLVideoElement Interface)
    ↓
MediaBunnyEngine (Coordination Layer)
    ├→ AudioEngine (Web Audio API)
    └→ VideoEngine (Canvas Rendering)
```

### 核心组件

#### 1. index.js
- **职责**: 插件入口点，创建canvas元素并代理到VideoShim
- **功能**:
  - 创建canvas和2D上下文
  - 实例化VideoShim
  - 将VideoShim的属性和方法代理到canvas对象
  - 处理ArtPlayer的resize事件
  - 管理生命周期（destroy）

#### 2. VideoShim.js
- **职责**: 模拟HTMLVideoElement接口
- **功能**:
  - 实现标准video元素的所有属性（currentTime, duration, paused等）
  - 实现播放控制方法（play, pause, seek）
  - 处理音量和播放速率
  - 转发事件到ArtPlayer
  - 管理MediaBunnyEngine实例

#### 3. MediaBunnyEngine.js
- **职责**: 协调音频和视频引擎
- **功能**:
  - 管理加载流程（load timeout, metadata loading）
  - 协调play/pause/seek操作
  - 同步readyState和networkState
  - 错误处理
  - 管理播放状态（paused, ended, seeking）

#### 4. AudioEngine.js
- **职责**: 音频播放和时钟源
- **功能**:
  - 使用MediaBunny加载音频轨道
  - Web Audio API播放音频
  - 提供准确的currentTime（作为主时钟）
  - 音量控制和静音
  - 播放速率调整
  - 缓冲区监控（starvation detection）

#### 5. VideoEngine.js
- **职责**: 视频帧渲染和同步
- **功能**:
  - 使用MediaBunny解码视频帧
  - 将帧渲染到canvas
  - 与音频时钟同步
  - 处理late frames（可选丢帧）
  - Poster图片显示
  - Preflight检查（range requests支持）

#### 6. EventTarget.js
- **职责**: 简单的事件系统
- **功能**:
  - addEventListener
  - removeEventListener
  - emit事件

## 数据流

### 加载流程
```
MediaBunnyEngine.load()
    ├→ AudioEngine.load()
    │   ├→ 创建Input
    │   ├→ 获取音频轨道
    │   ├→ 创建AudioBufferSink
    │   └→ 触发metadata回调
    └→ VideoEngine.load()
        ├→ Preflight检查（可选）
        ├→ 创建Input
        ├→ 获取视频轨道
        ├→ 创建CanvasSink
        ├→ 初始化iterator
        └→ 触发metadata回调
```

### 播放流程
```
MediaBunnyEngine.play()
    ├→ AudioEngine.play()
    │   ├→ 恢复/创建AudioContext
    │   └→ 启动音频buffer迭代器
    └→ VideoEngine.start(audioEngine)
        ├→ 保存audio时钟引用
        └→ 启动渲染循环（requestAnimationFrame）
```

### 渲染循环
```
VideoEngine.render()
    ├→ 获取当前音频时间
    ├→ 发送timeupdate事件
    ├→ 检查是否到达结束
    ├→ 如果nextFrame时间到了
    │   ├→ 清除canvas
    │   ├→ 绘制frame
    │   └→ 请求下一帧
    └→ requestAnimationFrame(render)
```

## 重构改进点

### 1. 代码组织
- ✅ 扁平化目录结构（移除engine/shim/utils子目录）
- ✅ 使用ES6类代替工厂函数
- ✅ 每个文件单一职责

### 2. 可读性
- ✅ 添加详细的JSDoc注释
- ✅ 有意义的变量和方法命名
- ✅ 逻辑分组和代码组织

### 3. 可维护性
- ✅ 清晰的依赖关系
- ✅ 统一的错误处理
- ✅ 一致的代码风格

### 4. 性能
- ✅ 优化的帧同步算法
- ✅ 改进的缓冲区监控
- ✅ 减少不必要的函数创建

### 5. 功能
- ✅ 移除未使用的工具函数（sleep.js）
- ✅ 简化事件系统
- ✅ 统一的配置选项

## 使用的外部库

- **mediabunny**: WebCodecs封装库，提供Input/Source/Sink抽象
- **ArtPlayer**: 视频播放器框架

## 浏览器API

- **WebCodecs API**: 视频/音频解码
- **Web Audio API**: 音频播放
- **Canvas API**: 视频渲染
- **requestAnimationFrame**: 渲染循环
