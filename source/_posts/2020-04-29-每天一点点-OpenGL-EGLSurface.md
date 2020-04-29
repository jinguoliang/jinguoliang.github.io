---
title: 每天一点点_OpenGL_EGLSurface
date: 2020-04-29 09:48:22
tags:
- Android
- EGL
- OpenGL
- GLES
- EGLSurface
-  ✮ ✮ ✮
categories:
- 编程
---

前面说到 EGLSurface 分两类: 

* 一类是绘制到屏幕上的，在 Android 上， 与系统的 Surface 连接，作为图像的生产着，Surface 内部的 BufferQueue 另一端连接消费者，比如 SurfaceFlinger 负责显示图像到屏幕， 编码器负责将图像编码等。

* 另一来绘制图像数据到有 EGL 实现的图像缓冲区， 是一个离屏的缓冲区。（这里还没接触过， 用第一种，也可以不显示出来，直接编码进文件， 不知道离屏是不是这个意思）


EGL 没有提供 lock/unlock 操作。 在执行了绘制操作后，执行 eglSwapBuffers() 提交当前帧。这个方法的名字来自传统的交换前段和后端的缓冲区。但是实际实现可能不同。这里的前段和后端的缓冲区，指的是双缓冲， 为了提高效率，在提交到前段缓冲区后，缓冲区就被消费者去使用了，在这同时，绘制后端缓冲区。

在同一时间，只有一个 EGLSurface 可以连接到 Surface（也就是说只有一个生产者连接到 BufferQueue），但是如果销毁了 EGLSurface， BufferQueuer 就可以在连接其他的生产者了。

一个线程可以在多个EGLSurface之间切换， 切换的方式是通过 makeCurrent 设置当前的 EGLSurface。一个 EGLSurface 在某个时间只能在一个线程作为当前的EGLSurface。这也好理解，如果同时被多个线程设置为当前的 EGLSurface， 那就可能同时多个线程输出图像数据到它上面。

EGL 不像 SurfaceHolder 是 Surface 的另一面。EGL 只是与之相关，但是独立的概念。EGL 可以不使用 Surface 实现。Surface 也可以在没有 EGL 情况下使用。EGLSurface 只是提供了一个地方让 GLES 绘制。

明天： 每天一点点_OpenGL_GLES实现



