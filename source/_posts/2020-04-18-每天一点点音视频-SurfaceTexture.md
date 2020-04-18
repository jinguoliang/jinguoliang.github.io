---
title: 每天一点点音视频_SurfaceTexture
date: 2020-04-18 11:14:52
tags:
- Android
- Graphics
- SurfaceTextue
categories:
- 编程
---

SurfaceTexture 将 Surface 和 GLES 里的文理绑定在一块。 它被用来往 GLES 输入图像数据

SurafceTexture 里包含了一个 BufferQueue， 应用作为这个 BufferQueue 的消费者， 另一端可能是在另一个进程里的 解码器， 相机等等。

当 BufferQueue 的生产者产生新数据时， 消费端，通过 onFrameAailable 获取到通知，然后可以调用 updateTexImage() 来释放之前获取到的图像缓冲区，重新获取新的。需要注意的是 updateTexImage() 必须要在 GLES 上下文， 因为更新获取新的缓冲区实际是将数据 保存到了文理里。

### 外部 GLES 纹理

有外部纹理就有内部纹理。

内部纹理是 OpenGL 里的普通纹理， 需要通过绑定 GL_Texture_2D 使用， 一般我们读如一个 Bitmap， 通过这种纹理上传到 GPU。

外部纹理， 需要绑定 GL_Texture_EXTERNAL_OES 使用， 在渲染文件里需要添加：

    #extension GL_OES_EGL_image_external : require

使用的格式不是 sample2D 而是 samplerExternalOES。

外部纹理的主要优势是能够直接渲染 BufferQueue 的数据。SurfaceTexture 会在创建 BufferQueue 的时候设置 GRALLOC_USAGE_HW_TEXTURE， 意思是可以被 GPU 使用， 被 GLES 识别。

### 时间戳 和 变换矩阵

SurfaceTexture 有一个方法 getTimeStamp() 可以获取当前缓冲区从生产者那产生的时间。比如相机的预览， 相机传感器作为生产者， 会带着时间，肯定这个时间更准确的指明了图像的显示时间。

SurfaceTexture 还有个方法 getTransformMatrax() 可以获取一个变换矩阵。因为生产者产生的图像可能消费者需要的图像的方向什么的不一致， 需要变换一下。其实可以对数据纠正了在送给消费者，但是消费者的需要可能还会做变换，这样就不如传个矩阵，消费者把自己的变换再加上就行，这样就避免了一次对数据的操作。举个例子 相机摄像头 输出数据图像是有特定的旋转角度的， 但是，我们的应用， 可能会横平竖屏，就需要做自己的变换。

这两个属性都会在 updateTexImage() 调用后更新，每一帧都可能不同

### setDefaultBufferSize（）

SurfaceTexture 作为消费者，会创建 BufferQueue， setDefaultBufferSize（） 用来设置缓冲区大小的。但是这是个默认大小， 还会被生产者改变。

每次调用该方法后， 生产者下次创建数据会生效。但是如果生产者是 GLES， 每次调用该方法后， 要重新将 SurfaceTexture 设置成 GLES 的 Surface。

现在， 我在项目中用到该方法的地方就是相机的预览， 因为我们在 Camera2 中，没有设置输出缓冲区的大小的地方， 通过该方法， 我们选择 Camera2 输出 Surface 的大小。

反思： 

感觉还是不够深入的理解

坏习惯已然开始， 连续的几天晚睡， 连续的几天晚期， 连续的几天没有9点写作。不过赶紧纠正就好，最高优先级。

明天： 每天一点点音视频_TextureView




