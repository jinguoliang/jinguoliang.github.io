---
title: 每天一点点音视频_SurfaceFlinger3
date: 2020-04-22 09:03:50
tags: 
- Android
- Graphics
- SurfaceFlinger
categories:
- 编程
---

前面说道 WindowManager 会向 SurafceFlinger 请求创建一个层， 在 WindowManager 那就是一个 Window， 而一个 Window 包括了一个 Surface 和 这个 Surface 在屏幕上的显示参数，比如显示位置等。

View， Window 和 Surface 的关系

Window 是一个容器对象， 它里面有 View， Surface， 还有其他一些参数

View 负责绘制， 比如 TextView 负责绘制文字。

Surface 负责存储， View 所绘制的东西到哪了呢， 就会知道了 Surface 上。

完结撒花

明天： 每天一点点音视频_HWC
