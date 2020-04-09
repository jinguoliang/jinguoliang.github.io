---
title: 每天一点点音视频_MediaCodec的C位出道
date: 2020-04-09 09:10:02
tags:
- 音视频
- Android
- MediaCodec
categories:
- 编程
---

说 MediaCodec 是 C 位出道，是因为， MediaCodec 在 Android 平台上， 硬件音视频编码的的关键模块。我们当前了解的只是 Java 层的， 实际上 ndk 也提供了 jni 层的。

MediaCodec 输入输出数据可以是三种：

1. 编码的数据， 这种数据可以保存到文件中，这时候需要 MediaMuxer 对数据打包， 可以从文件中读取，这时候需要 MediaExtractor
2. 原始音频数据， PCM， 之前提到过， 可以从 AudioReord 读取， 也可以从 AudioTrack 输出
3. 原始的视频数据， 有几种格式， 在 Android 上比较方便的操作方式是使用 Surface， 这个 Surface 可以从 Camera 来， 从 OpenGL 来， 录屏幕来， 可以输出到 OpenGL， 输出到 UI等等。

我的最初的想法是想把音视频的大的概念铺开， 但是， 现在感觉是这种蜻蜓点水不是说不好， 只是如果能于工作联系起来，把那些花好久解决的问题记录下来，可能更好，当然也可以都进行。

明天： 每天一点点音视频_Surface