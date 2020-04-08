---
title: 每天一点点音视频_MediaCodec使用示例
date: 2020-04-08 09:09:48
tags:
- 音视频
- MediaCodec
- 示例
categories:
- 音视频
---

MediaCodec的数据处理过程分为异步和同步两种模式：

以下是一部模式：

    MediaCodec codec = MediaCodec.createByCodecName(name);
    MediaFormat mOutputFormat; // member variable
    codec.setCallback(new MediaCodec.Callback() {
        @Override
        void onInputBufferAvailable(MediaCodec mc, int inputBufferId) {
            ByteBuffer inputBuffer = codec.getInputBuffer(inputBufferId);
            // fill inputBuffer with valid data
            …
            codec.queueInputBuffer(inputBufferId, …);
        }
        
        @Override
        void onOutputBufferAvailable(MediaCodec mc, int outputBufferId, …) {
            ByteBuffer outputBuffer = codec.getOutputBuffer(outputBufferId);
            MediaFormat bufferFormat = codec.getOutputFormat(outputBufferId); // option A
            // bufferFormat is equivalent to mOutputFormat
            // outputBuffer is ready to be processed or rendered.
            …
            codec.releaseOutputBuffer(outputBufferId, …);
        }
        
        @Override
        void onOutputFormatChanged(MediaCodec mc, MediaFormat format) {
            // Subsequent data will conform to new format.
            // Can ignore if using getOutputFormat(outputBufferId)
            mOutputFormat = format; // option B
        }
        
        @Override
        void onError(…) {
            …
        }
    });
    codec.configure(format, …);
    mOutputFormat = codec.getOutputFormat(); // option B
    codec.start();
    // wait for processing to complete
    codec.stop();
    codec.release();

以下是同步模式：

    MediaCodec codec = MediaCodec.createByCodecName(name);
    codec.configure(format, …);
    MediaFormat outputFormat = codec.getOutputFormat(); // option B
    codec.start();
    for (;;) {
        int inputBufferId = codec.dequeueInputBuffer(timeoutUs);
        if (inputBufferId >= 0) {
            ByteBuffer inputBuffer = codec.getInputBuffer(…);
            // fill inputBuffer with valid data
            …
            codec.queueInputBuffer(inputBufferId, …);
        }
        int outputBufferId = codec.dequeueOutputBuffer(…);
        if (outputBufferId >= 0) {
            ByteBuffer outputBuffer = codec.getOutputBuffer(outputBufferId);
            MediaFormat bufferFormat = codec.getOutputFormat(outputBufferId); // option A
            // bufferFormat is identical to outputFormat
            // outputBuffer is ready to be processed or rendered.
            …
            codec.releaseOutputBuffer(outputBufferId, …);
        } else if (outputBufferId == MediaCodec.INFO_OUTPUT_FORMAT_CHANGED) {
            // Subsequent data will conform to new format.
            // Can ignore if using getOutputFormat(outputBufferId)
            outputFormat = codec.getOutputFormat(); // option B
        }
    }
    codec.stop();
    codec.release();

这是官方文档的例子， 这样写出看起来还挺简单的， 但是当考虑到多线程， 流程上的控制，比如流结束终止循环等，就比较复杂了。

不过这样官方提供的示例还是给人一种标准的感觉，不像看项目中的代码，会有很多小问号，比如为什么会用 for（；；）， 一次输入不需要循环多次输出吗（这个问题，可以通过外层这个大循环解决），输入数据的填入也受数据源的影响，怎么处理的。

所以还是有必要多看官方示例，然后多问为什么，想想它设计背后的依据。

明天： 每天一点点音视频_MediaCodec的C位出道
