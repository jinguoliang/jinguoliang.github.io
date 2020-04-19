---
title: 每天一点点音视频_TextureView
date: 2020-04-19 09:56:56
tags:
- Android
- Graphics
- TextureView
categories:
- 编程
---

TextureView 绑定了一个 View 和一个 SurfaceTexture

### 使用 GLES 渲染

TextureView 里的 SurfacceTexture， 可以传给 EGL 创建 EGLSurface， 作为 GLES 的渲染目标。 TextureView 负责从 SufrfaceTexture 读取数据渲染到 View 上。

### TextView VS SurfaceView

之前说过了， 我选 TextureView

TextureView 负责从 SurfaceTexture 读取数据绘制到 View 上，然后就可以把 TextureView 作为一个普通的 View 了， 透明度呀，旋转呀都可以。

SurfaceView 的 View 只是一个代表， 实际显示的内容时在单独的一个层上，由 SurfaceFlinger 负责对层做融合。

### TextureView 里 SurfaceTexture 的复用

当横竖屏切换时， Acitivity 重启， TextureView 和 SurfaceView 都会先销毁。但是 TextureView 的回调 onSurfaceDestroyed() 的返回值可以决定它里面的 SurfaceTexture 是否销毁。 当返回 false 时， 就不会销毁， 在 Activity 重启后， TextureView.setSurfaceTexture() 就可以重复利用之前的 SurfaceTexture。 这样就可以无间断显示了。SurfaceView 没有提供这种复用机制。

明天： 每天一点点音视频_SurfaceFlinger
