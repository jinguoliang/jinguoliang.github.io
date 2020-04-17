---
title: 每天一点点音视频_SurfaceView
date: 2020-04-16 09:10:08
tags:
- Android
- SurfaceView
- TextureView
- Graphics
categories:
- 编程
---

Android 中的显示 UI，通过 View， 形成一棵树， 绘制到了一个 surface 上。这些 UI 操作都是在 UI 线程。

SurfaceView 也会一个 View， 可以被添加到 UI 树里， 但是 View 的内容是透明的， 它要显示的内容通过一个单独的 Surface 显示

当 SurfaceView 变为可见时， SurfaceControler 会请求 SurfaceFlinger 创建一个新的 Surafce，默认新创建的 Surface 会在 UI Surface 的后面。可以通过 Z 轴顺序让新 Surface 在上面。

SurfaceView 与 TextureView 相比， 效率更高， 因为它使用了单独的 Surface， 这样就不用在将图像数据从 Surafce 复制到 UI 的Surface 上了。而是直接又硬件合成器来合成。

### SurafceView 和 Activity 的生命周期

SurfaceView 的渲染在非UI线程，独立的线程。

当 Activity 启动时：

1. Activity.onCreated()
2. Activity.onResume()
3. surfaceCreate()
4. surafceChanged()

当 关闭 Activity 时:

1. activity.onPaused()
2. surfaceDestroyed()

当旋转屏幕时， Activity会迅速的重启，这时候，surafceCreated（） 可能会在 activity.onPaused（） 之后，这是后可以通过判断 activity.isFinsihing()，如果时直接推出执行。

当按电源健息屏后， Activity会 onPaused() 但是 surfaceDestroyed(), 也就是说 SurfaceView 依然在，依然绘制。如果所平界面会强制转屏， Activity 会重启，但是 SurfaceView 依然时之前的（1. 看来 surfaceDestroyed 是在 onPaused 里执行的， 一旦 onPaused 里没执行， activity销毁也不会执行。2. 这也谈蛋疼了吧）

SuraceView 与 Activity 的生命周期已经乱了， 在加上一个渲染线程，简直时大乱特乱。我建议不用它，主要时我们怎么用过它，不用它有几个原因。与 TextureView 比，它的优势就是效率高一点，但是，缺点很多， 单独的 Surface 导致对 View 的一些参数设置 SurfaceView 不起作用， 比如背景色，旋转呀其他变换呀。

### GLSurfaceView

GLSurfaceView 从名就可以看出， 它是在 SurfaceView 的基础上，加上了 GLES， 在单独的线程创建了 GLES 上下文， 很容易就可以进行 GLES 的操作， 不用执行 EGL 的操作。

但是它依然有 SurfaceView 的那些缺点， View 的一些属性对它不起作用。

反思： 今天起晚， 半小时直接压缩没了。

明天： 每天一点点音视频_SurfaceTexture


