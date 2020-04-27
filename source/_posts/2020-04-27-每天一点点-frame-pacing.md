---
title: 每天一点点_frame_pacing
date: 2020-04-27 09:21:32
tags:
- Android
- Graphics
- FramePacing
categories:
- 编程
---

Frame Pacing Library 也叫 Swappy 是 Android Game SDK 的一部分。它帮助 OpenGL 和 Vulkan 在 Android 上实现游戏的顺滑渲染，纠正帧的步调节奏。

Frame Pacing 是 游戏逻辑 和 渲染循环的同步。渲染循环指的是系统的显示子系统和底层显示硬件的循环。Android 的显示子系统被设计避免屏幕内容撕裂等问题。

显示子系统如何避免内容的撕裂呢？

1. 缓存之前的帧
2. 检测是否有迟到的帧，所谓迟到指的是，因为有固定的帧率，每一帧有特定的的时间，如果晚于这个时间，就是迟到
3. 当检测到迟到的帧时，显示当前的帧

这个逻辑很简单嘛

明天： 每天一点点_OpenGL_概述



