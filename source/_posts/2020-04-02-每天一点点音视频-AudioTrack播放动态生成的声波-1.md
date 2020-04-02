---
title: 每天一点点音视频_AudioTrack播放动态生成的声波_1
date: 2020-04-02 08:39:03
tags:
- 音视频
- 声波
categories:
- 编程
---

本来想来写播放动态生成的声波，昨天晚上失眠，想了想如何生成声波，于是，更失眠了。

这篇文章我们来写一个生成声波的函数， 所谓函数，是这个样子的：

    振幅 = f(时间)

简化问题，我们生成正弦波， 先把正弦波的参数列一下：

1. 时间
2. 振幅
3. 最大振幅
4. 周期（频率）

以上的参数，也就是数据

剩下的是算法， 既然是正弦波， 肯定与 sin() 有关

最终的结果如下：

    class WaveGenerator(val maxAmplitude: Float, val rate: Int) {
        fun getAmplitude(time: Float): Float {
            val cycle = PI.toFloat() * 2
            val radiansPerSecond = rate * cycle
            return sin(time * radiansPerSecond) * maxAmplitude
        }
    }

我使用了单元测试，爽！！

    @Test
    fun `计算某个时间点的振幅`() {
        generator = WaveGenerator(1f, RATE_ONE)

        assertThat(generator.getAmplitude(0f)).isWithin(0.001f).of(0f)
        assertThat(generator.getAmplitude(0.25f)).isWithin(0.001f).of(1f)
        assertThat(generator.getAmplitude(0.5f)).isWithin(0.001f).of(0f)
        assertThat(generator.getAmplitude(0.75f)).isWithin(0.001f).of(-1f)
        assertThat(generator.getAmplitude(1f)).isWithin(0.001f).of(0f)

        generator = WaveGenerator(1f, RATE_TWO)

        assertThat(generator.getAmplitude(0f)).isWithin(0.001f).of(0f)
        assertThat(generator.getAmplitude(0.25f)).isWithin(0.001f).of(0f)
        assertThat(generator.getAmplitude(0.5f)).isWithin(0.001f).of(0f)
        assertThat(generator.getAmplitude(0.75f)).isWithin(0.001f).of(0f)
        assertThat(generator.getAmplitude(1f)).isWithin(0.001f).of(0f)
        assertThat(generator.getAmplitude(0.125f)).isWithin(0.001f).of(1f)
        assertThat(generator.getAmplitude(0.375f)).isWithin(0.001f).of(-1f)

    }

到点了，明天见
