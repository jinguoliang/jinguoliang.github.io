---
title: 每天一点点_Android_Graphics_总结
date: 2020-05-02 09:23:51
tags:
- Android
- Graphics
categories:
- 编程
---

至此， 把 AOSP 上 图像 部分 的文档看了， 忽略了底层驱动的实现部分，一些我之前没有了解的部分，现在也不想了解的部分。

再来最开始的这个图片：

![](2020-04-10-每天一点点音视频-Graphics/2020-04-10-09-24-34.png)

上面的图像流生产者， 下面的图像流消费者。

中间由 Surface 作为传递者， 同时 windowManager 提供图像现实的一些附加信息，比如位置，格式等等。

Surface 是 BufferQueue 上层的 API， 一个代表。

SurfaceView 将 BufferQueue 一端连接 SurfaceFlinger 作为消费者，另一端作为生产者，绘制。可以通过 SurfaceHolder 传给 CameraPreview， MediaPlayer， EGL 等等。

TextureView 在作用上跟 Surface 类似，只不过实现上不同， SurfaceView 使用了单独的 Window， 单独的 Window 以为着单独的 Surface， 单独的 BufferQueue， 单独的位置参数等， 直接通向 SurfaceFlinger，效率会高，但是与页面其他元素的交互性变差了，因为与他们不再一个 View 树。TextureView 则相反， 与其他 View 在同一个 View 树， 图像数据会合成到 View 树的 Surface 上。

EGLSurface 是属于 OpenGL 的概念， 由 EGL 在 Android 平台实现，从而可以将 OpenGL 绘制的图像传给 Android 系统。EGL 类似两个系统之间搭桥的。

上面的 EGLSurface 负责将 OpenGL 的图像传到 Android。而SurfaceTexture 负责将 Android 的 Surface 传给 OpenGL， 成为了一个 Texture， 从而可以进行 OpenGL 操作。

完工。

换换口味，该研究一下格式，协议啥的了，比较讨厌的这些东西，人家说做自己害怕的事情能让自己更快的提高。但是我觉的，关键是能不能自己害怕的事情变得不那么害怕，有趣一点。

明天： 每天一点点音视频_Bitmap了解



