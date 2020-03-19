---
title: 每天一点点音视频相关_ffmpeg解包数据示例_part2
date: 2020-03-19 08:58:17
tags:
- ffmpeg
- C
- 音视频
categories:
- 编程
---

昨天我们了解了 ffmpeg 里从视频文件里读取数据的数据结构和方法， 如下：

1. avformat_alloc_context() 分配一个数据结构，用来存放打开的视频的信息，相当于是创建对象
2. avformat_open_input(format_context, url, NULL, NULL) 打开 url 指定的视频文件， 读取头信息， 存入 format_context
3. avformat_find_stream_info(format_context, NULL) 读取流的信息， 此后，就可以知道每个轨道的信息了
4. av_find_best_stream(format_context, AVMEDIA_TYPE_VIDEO, -1, -1, NULL, 0) 查找指定类型的轨道的 index， 包括音频，视频，字母等
5. format_context->streams[video_index] 拿到了一个流， 就是轨道， 以后的解码操作都是基于轨道的。

下面详细说说流里包括那些信息：

* AVCodecParameters *codecpar 编码器用到的一些参数， 比如帧的宽，高， 码率等等
* av_dict_get(v_stream->metadata, "rotate", m, AV_DICT_MATCH_CASE)， 可以获取一些元数据， 这里可能类似与 Android 里的 MediaFormat 包含的数据
* format_context->duration 视频时长

下面， 重点来说明一下， seek 和 读包

我们在读取视频信息的时候， 可以选择制定在某个时间， 读取数据， 这样就可以不用从头一帧一帧的解码了， 实现进度的跳转。

av_seek_frame(format_context, -1, seek_to, AVSEEK_FLAG_BACKWARD)

第二个参数， 可以指定基于某个流进行seek， seek_to 是时间， AVSEEK_FLAG_BACKWARD 是 Seek的模式， 比如， 额， 这个不是我所认识的模式，之前我了解的 seek模式如相对于当前位置seek， 或者绝对时间的seek， 这里的模式却是， 基于 byte 的seek， 可以seek到任何帧， 还是seek 到关键帧等。

在指定好要读的位置， 下一步，就是开始读了

在读之前， 县准备好存贮一个 包 数据的结构

AVPacket * packet = av_packet_alloc()

av_read_frame(format_context, packet); 

相同的套路：

1. 分配一个数据结构， 有专门的方法
2. 填充数据

至此， 解包完成， 获取到了一个一个的 packet

明天： 每天一点点音视频相关_ffmpeg解码器
