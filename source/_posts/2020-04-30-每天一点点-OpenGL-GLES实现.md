---
title: 每天一点点_OpenGL_GLES实现
date: 2020-04-30 08:55:09
tags:
- Android
- OpenGL
- GLES
- EGL
categories:
- 编程
---

### GLES 和 EGL

OpenGL 是一个跨平台的图形 API， 它为 3D 处理硬件声明了一套软件接口。 OpenGL ES  是 OpenGL 的一个子集， 专门用于嵌入式设备。OpenGL ES 缩写为 GLES。

Android 设备需要提供 EGL， GLES 1.x， GLES 2.0 的驱动。对 GLES 3.x 的支持是可选的。关键的注意事项包括：

* 确保 GL 驱动是健壮的，符合 OpenGL ES 标准
* 允许无限数量的 GL Context。因为 Android 允许应用在后台保持 GL Context 活着。所以不应该在驱动里限制 GL Context 的数量。
* 注意每个 GL Context 分配的内存， 因为经常会同时有 20-30 个 GL Context
* 支持 YV12 图像格式和其他 YUV 图像格式。他们来自系统的其他组件。比如来自 MediaCodec 或者 Camera
* 支持强制的扩展： EGL_wait_sync, GL_OES_texture_external, EGL_ANDROID_image_native_buffer 和 EGL_ANDROID_recordable。另外， 硬件合成器1.1版本或更高版本要求支持 EGL_ANDROID_framebuffer_target 扩展

支持 EGL_ANDROID_blob_cache, EGL_KHR_fence_sync, 和 EGL_ANDROID_native_fence_sync 也是被强烈推荐去实现的。

以上的扩展，只用过 GL_OES_texture_external， 它的使用情景是，当我们使用 texture 接收了系统的 SurfaceTexture 来的图像数据。


