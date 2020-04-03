---
title: 每天一点点音视频_AudioTrack播放动态生成的声波_2
date: 2020-04-03 08:55:27
tags:
- 音视频
- 声波
categories:
- 编程
---

之前，我们实现了一个获取某个时间的振幅的正弦波的函数， 今天要实现一个方法来获取一段时间的正弦波的数据。以便于提供给 AudioTrack 播放

代码如下：


    @Test
    fun `生成正弦波数据存入 buffer`() {
        generator = WaveGenerator(1f, RATE_ONE)
        val buffer = FloatArray(2)
        generator.generateWave(1, 0f, buffer)
        assertThat(buffer).usingTolerance(0.0001).containsExactly(0f, 0f)

        generator.generateWave(2, 0f, buffer)
        assertThat(buffer).usingTolerance(0.0001).containsExactly(0f, 0f)

        generator.generateWave(4, 0f, buffer)
        assertThat(buffer).usingTolerance(0.0001).containsExactly(0f, 1f)

        generator.generateWave(1, 0.25f, buffer)
        assertThat(buffer).usingTolerance(0.0001).containsExactly(1f, 1f)

        generator.generateWave(2, 0.75f, buffer)
        assertThat(buffer).usingTolerance(0.0001).containsExactly(-1f, 1f)
    }

    class WaveGenerator(val maxAmplitude: Float, val rate: Int) {

        fun getAmplitude(time: Float): Float {
            val cycle = PI.toFloat() * 2
            val radiansPerSecond = rate * cycle
            return sin(time * radiansPerSecond) * maxAmplitude
        }

        fun generateWave(sampleRate: Int, startTime: Float, buffer: FloatArray) {
            val sampleInterDuration = 1f / sampleRate
            buffer.forEachIndexed { index, _ ->
                buffer[index] = getAmplitude(startTime + sampleInterDuration * index)
            }
        }
    }

很快就写出来了，爽

不过，之前我想了好久的，之前也单元测试驱动过，写的很差，可能的确会子潜意识里酝酿吧。不过我还是总结以下思路吧。

1. 首先准备好相关的数据（这让我想起来初中的时候，有个数学老师，一个老头，好像还教过我们生物，还教过我们鼓号队，它当时就说做数学题的时候，先把一致的条件都找出来。我又想起来，好像有段时间做数学题都有格式的（条件： 解：））

2. 找到一种解法，简单的模型

3. 将已知数据与模型对接，一般就是将某些数据转化为输入， 将输出转化成所需要的数据。

这好像就是函数是编程，或者解数学体的思路。

OK， 数据准备好了，下一步，只需要稍微转化一些，送入 AudioTrack 这个模型了。

明天见！！

