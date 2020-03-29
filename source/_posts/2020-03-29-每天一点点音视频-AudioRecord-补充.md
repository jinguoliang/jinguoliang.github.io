---
title: 每天一点点音视频_AudioRecord_补充
date: 2020-03-29 09:23:25
tags:
- 音视频
- AudioRecord
- Android
categories:
- 编程
---

之前的文章说过，AudioRecord 很简单，它的使用的确很简单，不过还有一些其他问题

## 构造的时候需要一个 audioSource

它代表了一个音频输入设备和特定的配置， 设备比如麦克风， 打电话的听筒声音等， 配置是根据特定的配置对设备的细分，比如适配语音识别的麦克风（这个没用过，不太理解）

## setRecordPositionUpdateListener 是何用

与之有关的有 setNotificationMarkerPosition 和 setPositionNotificationPeriod， 这两个分别设置到达某个录制位置或者周期性的间隔多久调用一次回调。

注意参数为 frame 数量。

这可能用来结束？ 或者周期性取样？

既然这么简单，不如一次性搞明白它， 明天来看看实际的应用： 每天一点点音视频_AudioRecord_实际应用总结