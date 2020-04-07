---
title: 每天一点点音视频_MediaCodec创建初始化
date: 2020-04-07 09:01:00
tags:
- 音视频
- Android
- MediaCodec
categories:
- 编程
---

首先要来看一下 MediaCodec 的创建需要解决的问题：

1. MediaCodec 分为编码器和解码器
2. 编解码特定的音视频格式，需要特定的编码器，可能有多个
3. 对于某中编码格式， 不同的编码器支持的特性可能不同

针对第一个问题：

MediaCodec 提供了区分编解码的方法： createDecoder/EncoderByType(java.lang.String)， MediaCodecList#findEncoder/DecoderForFormat

针对第二个问题，第三个：

MediaCodecList#findEncoder/DecoderForFormat 会根据格式去查找最适合的， 我们可以对 MediaFormat 添加特定的需求的属性查找特定的编解码器。

明天： 每天一点点音视频_MediaCodec使用示例
