---
title: 每天一点点音视频_SurfaceFlinger2
date: 2020-04-21 09:15:59
tags:
- Android
- Graphics
- SurfaceFlinger
categories:
- 编程
---

之前说到， App 向 WindowManager 请求一个 Window 或者叫 Surface， WindowManager 进而想 SurfaceFlinger 请求一个层， 然后 SurfaceFlinger 返回。

App 通过 Surface 可以在任意时刻提交一个图像缓存， 但是 SurfaceFlinger 只在屏幕刷新时才会苏醒来接受图像缓存。屏幕的刷新是与设备相关的。这会减少内存的使用， 避免屏幕刷新时的图像显示撕裂（反正就是那种，数据在屏幕不全的状态）

当屏幕在两次刷新之间时， 会给 SurafceFlinger 发送 VSYNC 信号。VSYNC 信号指示这时候刷新屏幕不会产生画面撕裂的效果。当 SurfaceFlinger 接受到 VSYNC 会遍历层的列表， 查找有没有新的图像缓冲区，如果由就请求过来，如果没有使用之前的。SurfaceFlinger 对每一个层，总要显示点东西，如果那一层没有缓冲区，就会把这一层忽略掉。

在 SurfaceFlinger 从所有可见层收集了所有图像缓冲区，它会询问 Hardware Composer (HWC) 如何操作。如果 HWC 标记某一层需要客户端合成， SuraceFlinger 会合成， 然后把输出的缓冲区输出给 HWC。

明天：  每天一点点音视频_SurfaceFlinger3
