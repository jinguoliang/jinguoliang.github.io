---
title: 每天一点点音视频_AudioTrack和AudioRecord
date: 2020-03-31 09:03:14
tags:
- 音视频
- Android
- AudioTrack
categories:
- 编程
---

AudioRecord 和 AudioTrack 这两个真的是好兄弟， 非常有对称美。

兄弟连 | 功能 | 数据 | 创建
-|-|-|- 
AudioRecord | 从音频输入设备读取数据 | PCM |  需要参数缓冲区大小， 采样率， 声道数， 数据位宽
AudioTrack | 向音频输出设备写入数据 | PCM | 需要参数缓冲区大小， 采样率， 声道数， 数据位宽

以上表格就是想说明，它们两个很像，一个负责读，一个负责写，真正实现无缝对接。

AudioTrack 的使用也是与 AudioRecord相同的：

1. 创建
2. 开始
3. 写数据
4. 停止

但是， AudioTrack 的创建，还需要多一些东西。

明天： 每天一点点音视频_AudioTrack的两种播放模式

---
参考[AudioTrack文档](https://developer.android.google.cn/reference/android/media/AudioTrack)
