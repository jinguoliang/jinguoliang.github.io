---
title: 每天一点点音视频_Surface和SurfaceHolder
date: 2020-04-15 09:05:19
tags:
- Android
- Graphics
- 翻译
- Surface
categories:
- 编程
---

之前写过一篇关于 Surface 的文章，那只是我自己的理解，现在的是翻译的官方文档，这是一个系列。

Surface 使得应用能够渲染图像到屏幕上， SurfaceHolder使得应用能够编辑控制 Surface。（这个说的是一般情况吧）

Surface 是图像生产者和消费者交换缓冲区的接口。真正负责交换功能的是 BufferQueue。

### Canvas 渲染

Canvas 的绘制是由 [Skia] 实现的。为了确保一块缓冲区不被多个客户同时更新， 或者一边写一边读，从 API 上对缓冲区的操作做了限制。如下：

* lockCanvas 锁住缓冲区，使用 CPU 渲染，然后返回 Canvas
* unlockCanvasAndPost 解索缓冲区并且提交给混合器
* lockHardwareCanvas 锁住缓冲区，使用 GPU 渲染， 然后返回 Canvas

注意的是， 使用 lockCanvas 锁住的 Surface 以后都不支持硬件加速了。这是因为 lockCanvas 会将 CPU 渲染器连接作为 BufferQueue 的生产者, 知道 Surface 销毁时才断开。CPU渲染器不想 GLES/Vulkan 渲染器，可以断开重联。

生产者第一次从 BufferQueue 获取缓冲区的时候， 缓冲区被初始化成 0， 初始化时必须的。但是， 如果重用了缓冲区， 缓冲区内容保留，如果如果在锁住缓冲区后没有做任何操作解索缓冲区，内容依然不会改变，生产者会循环之前渲染的帧。

Surface 的 lock/unlock 会保持对之前渲染的缓冲区的引用，如果在 lock 指定了一个脏区域，也就是指明这次绘制指挥在该区域进行，它就会把之前缓冲区非脏区域的像素考过来， 这会快一些。

### SurfaceHolder

SurfaceHolder 使得系统将所有权分给应用。因为一些 API 使用 SurfaceHolder 来的到 Surface。SurfaceView 内部就由一个 SurfaceHolder， 大部分与 View 交互的组件都是用 SurfaceHolder。其他的 MediaCodec 呀，直接使用 Surface。（为什么呢）


反思： 

又离道了，不过偶尔的离道没关系，只要不连续就好，重复的一个怀行为才是一个坏习惯的开始。

原因， 内容多了， 半小时没写完， 然后就忘了提交了。

另外，开始陷于翻译内容了，没有自己全剧的理解了。

明天： 每天一点点音视频_SurfaceView