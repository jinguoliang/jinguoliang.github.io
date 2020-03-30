---
title: 每天一点点音视频_AudioRecord_实际应用总结
date: 2020-03-30 08:46:30
tags:
- 音视频
- Android
- AudioRecord
categories:
- 编程
---

这里的实际应用总结是我转每去 github 搜的星最多的几个项目的使用的总结。我平时用的时候感觉使用的太草率了。没有去学习一些人家的。以星最多的项目来看并不是什么好的方式，因为它的星的多少根某一块小功能可能几乎没有关系，不过有个标准总是好一些的（我觉得）

## ScreenRecorder

源码： app/src/main/java/net/yrom/screenrecorder/MicRecorder.java

在创建 AudioRecord 后，要检查它的状态是不是初始化好的，如果没有初始化好，说明传给它的参数有问题。

一个东西的使用还是很容易掌握的，关键是如歌让它适应在某个环境中，比如多线程的环境， 比如如何与其他的模块协同工作。

## continuous-audiorecorder

源码： recorder/src/main/java/com/github/lassana/recorder/AudioRecorder.java

这个项目实现了一个 AudioRecorder， 增强版 AudioRecord， 添加了暂停继续功能。使用的 MediaRecorder。原理很简单，暂停继续的时候重新录制一个视频，然后和之前的视频合并，使用到了 mp4parser（跑题了）

## Android-AudioRecorder-App

源码： app/src/main/java/in/arjsna/audiorecorder/recordingservice/AudioRecorder.java

这个代码让我眼前一亮，果断点星。使用了 RxJava 来包装 AudioRecord， 从而实现线程的调度，和与其他模块的数据传递。

另外， 实现了计时功能， 就是单独开个计时器， 我之前也这么做的，并不能很好的做到与实际录制的同步启动和停止。我想，可以使用之前说道的标记回调。

就这样吧，关键是这个流程更重要

录制了音频，就绪要播放， 先形成最小闭环，然后在让这个环更大

明天： 每天一点点音视频_AudioTrack