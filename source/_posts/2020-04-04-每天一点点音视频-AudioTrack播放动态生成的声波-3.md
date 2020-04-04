---
title: 每天一点点音视频_AudioTrack播放动态生成的声波_3
date: 2020-04-04 08:57:23
tags:
- 音视频
- 声波
categories:
- 编程
---

异常顺利， 下面的代码播放中央C的声音：

{% codeblock lang:kotlin %}

    val sampleRate = 44100
    val channel = AudioFormat.CHANNEL_OUT_STEREO
    val encodingBit = AudioFormat.ENCODING_PCM_FLOAT
    val sampleRateForCenterC = 261

    val waveGenerator = WaveGenerator(1f, sampleRateForCenterC)

    val minBuffSize = AudioTrack.getMinBufferSize(
        sampleRate,
        channel,
        encodingBit
    )
    val player = AudioTrack.Builder()
        .setAudioAttributes(
            AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_MEDIA)
                .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                .build()
        )
        .setAudioFormat(
            AudioFormat.Builder()
                .setEncoding(encodingBit)
                .setSampleRate(sampleRate)
                .setChannelMask(channel)
                .build()
        )
        .setBufferSizeInBytes(minBuffSize)
        .build()
    player.play()
    Thread {
        val audioData = FloatArray(minBuffSize)
        var startTime = 0f
        while (!isDestroyed) {
            val duration = waveGenerator.generateWave(sampleRate, startTime, audioData)
            player.write(audioData, 0, minBuffSize, AudioTrack.WRITE_BLOCKING)
            startTime += duration
        }
        player.stop()
    }.start()

{% endcodeblock %}

让我很意外的是，竟然很好听，纯正的中央C。在我的认识了，乐器的声音都不是单独的正弦波。可能那种复杂决定了音色吧。

还有问题， 播放一段时间后，会增加额外的杂音， 猜测可能是取整这种问题。

还有很多可以搞的， 可以调节频率， 可以显示波形线， 可以对不同频率的音进行叠加等等， 是个大坑。

我的每天一点点，还是专注于音视频的整个领域的知识点，先把面铺的广一点，至于这个坑，会填的。

明天： 每天一点点音视频_MediaCodec

---
仓库在这 [WavePlayer](https://github.com/jinguoliang/WavePlayer)


