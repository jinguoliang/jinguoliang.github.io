---
title: 每天一点点音视频_SurfaceFlinger
date: 2020-04-20 09:11:37
tags:
- Android
- Graphics
- SurafceFlinger
categories:
- 编程
---

SurfaceFlinger 负责接受， 合并，然后发送图像缓存到显示屏。WindowManager 负责发送图像缓存和 Window 的元数据给 SurfaceFlinger 以便于它合并 Surface 到显示屏。

### SurfaceFlinger

SurfaceFling 由两种方式接受图像缓存， 一种通过 BufferQueue 和 SurfaceControl, 另一种通过 ASurfaceControl， 这里只说明前一种， 因为后一种是 Android 10 新加入的，太新了（这也算个理由？？）

当一个应用显示到前台时， 它会向 WindowManager 请求图像缓存， WindowManager 会 SurfaceFlinger 请求一个层， 这里的层包括一个 Surface 和一个 SurfaceConroler， Surface 里时 BufferQueue, SurafceControler 里是这一帧的元数据，比如这一层的显示位置呀什么的。SuraceFlinger 创建层发送个 WindowManager, WindowManger 把 Surface 发送个应用，但是留下 SurfaceControler 以便来控制 App 在屏幕上的显示。

这里三个角色

1. APP 请求显示 --> Surface

2. WindowManager 请求层 --> Surace 和 SuraceControler 

3. SurfaceFlinger 制造一个层返回、

明天： 每天一点点音视频_SurfaceFlinger2
