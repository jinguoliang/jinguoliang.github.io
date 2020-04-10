---
title: Android上实现预览录制OpenGL处理过的相机数据
date: 2020-04-09 16:31:03
tags:
- Android
- 相机
- Camera
- 音视频
- OpenGL
categories:
- 编程
---

在 Android 上， Camera2 支持以 Surface 的方式将视频数据传出。

我们可以通过创建 OpenGL 上下文， 并在其冲分配一个 texture， 接着创建 SurfaceTexture, 继而创建 Surface, 从而可以接受相机的数据。

这样相机的数据以 texture 的形式进入 OpenGL， 就可以使用 OpenGL 处理了，特别注意的是， 这时候的 texture 不应该绑定到 GLES20.GL_TEXTURE_2D, 而是绑定到 GLES11Ext.GL_TEXTURE_EXTERNAL_OES。

至于预览， 可以使用 TextureView, 继而得到 Surface， 继而得到 EGLSurface， 就可以使用 OpenGL 向上面绘制东西了。

可以从编码器或者 MediaRecorder 获取 Surface， 进而得到 EGLSurface， 这样，在 OpenGL 上下文， 可以切换两个 EGLSurface， 分别绘制。

这样数据流向为 Camera -> OpenGL -> TextureView 或者 编码器

Camera 的输出分辨率由在 OpenGL 上下文创建的 SurfaceTexture 的 defaultBuffer 分辨率决定。TextureView有显示在View上的分辨率， 也有背后 SurfaceTexture 的分辨率，前者由 View 分辨率决定， 后者由 defaultBuffer 分辨率决定。编码器 MediaRecorder 可以直接配置视频的分辨率分辨率。

TextureView 内部的 Surface 如何显示到 View 上， 是由 TextureView 的 setTransform() 来决定的

在使用 SurfaceTexture 接受数据的时候， updateTexImage（） 后，可以通过getTransformMatrix() 得到一个变换矩阵， 但是还是要叠加变换，因为 Camera 的输出帧分辨率，与 OpenGL 的输出分辨率不同。

好吧，我自己感觉很清楚，因为花了好长时间弄明白了，但是我也很清楚，读者肯能是懵比状态。


