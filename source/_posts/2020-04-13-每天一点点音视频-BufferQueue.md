---
title: 每天一点点音视频_BufferQueue
date: 2020-04-13 09:16:22
tags:
- Android
- Graphics
- BufferQueue
- 翻译
- 碎碎念
categories:
- 编程
---

BuferQueue 连接了图形数据的生产者和消费者，消费者不仅仅负责把数据显示出来，还可以负责对数据进一步处理，比如 GLES。几乎所有图像数据缓冲的移动都依赖 BufferQueue。

Gralloc 负责分配图形缓存， 通过两个供应商特定的 HIDL 接口实现， （hardware/interfaces/graphics/allocator/ 和 hardware/interfaces/graphics/mapper/）

## 消费者和生产者

消费着创建并拥有 BufferQueue 数据结构，并可以在与生产者不同的进程存在。

当一个生产者需要缓冲区，它会通过 dequeueBuffer() 来请求一个空的缓冲区，并且会声明好宽高和像素格式，其他一个使用的控制项。然后生产者会将数据填入，通过 queueBuffer() 返还缓冲区。下一步，消费者通过 acquireBuffer() 获取填了数据的缓冲区，使用缓冲区的内容，最后通过 releaseBuffer() 返还数据。


BufferQueue 的很多特性（比如最大的缓冲区数量）都是由生产者和消费者决定的。BufferQueue会根据自己的需要来分配缓冲区。除非特性改变，否则，缓冲区会被一直保持。比如生产者请求不同大小的缓冲区，就的缓冲区就会被释放，新的会被分配。

缓冲区内容不会被 BuferQueue 复制，因为移动这么大的数据太低效了。缓冲区通过句柄来传递。

### Gralloc

Gralloc 在分配内存时会根据几个 flags， 比如：

* 内存多久会被软件访问（CPU）
* 内存多久会被硬件访问（GPU）
* 是否可以作为 GLES texture
* 是否会被视频编码器使用

比如一个生产者声明缓冲区为 RGBA_8888, 这就表示该缓冲区将被软件访问（意味着从 CPU 访问像素）, Gralloc 分配了4个字节的像素，格式为 RGBA 的顺序。

Gralloc 返回的内存的句柄可以在进程间通过 Binder 传递。

反思：

我现在对 BufferQueue 比较了解了，但是只是对它的使用上，不了解内部机制，实现。


昨天没写完，破了规矩，偶尔的脱轨一次没关系，回来就是，禁止连续脱轨，那时一个还习惯的开始。

明天： 每天一点点音视频_Surface和SurfaceHolder