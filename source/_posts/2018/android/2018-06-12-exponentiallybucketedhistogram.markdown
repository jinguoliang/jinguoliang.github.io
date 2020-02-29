---
layout: "post"
title: "ExponentiallyBucketedHistogram"
date: "2018-06-12 20:24"
category: "Think In Writing"
tags: Android 源码 QueueWorker
---

### 接 QueueWork

在看 QueueWork 源码的时候，故意忽略掉了 debug 的相关代码，但是 ExponentiallyBucketedHistogram 这个类名看着还是挺吓人的。如果什么东西看着很可怕，让我们不敢接近，那我们就农村包围城市，逐渐了解它，知道发出那声感叹：原来没什么呀！！

[源码在这](https://android.googlesource.com/platform/frameworks/base/+/master/core/java/com/android/internal/util/ExponentiallyBucketedHistogram.java)

### 先从字面理解

Exponentially 是以指数方式地，成倍地
Bucketed 桶
Histogram 直方图，柱状图

额，还不知道是什么东西，会生成直方图？

###　看看怎么用的

``` java
private final static ExponentiallyBucketedHistogram
            mWaitTimes = new ExponentiallyBucketedHistogram(16);

// ...

if (waitTime > 0 || hadMessages) {
    mWaitTimes.add(Long.valueOf(waitTime).intValue());
    mNumWaits++;
    if (DEBUG || mNumWaits % 1024 == 0 || waitTime > MAX_WAIT_TIME_MILLIS) {
        mWaitTimes.log(LOG_TAG, "waited: ");
    }
}

```

发现用法实在是简单，只是在每次处理完任务后，把处理事件添加到这个直方图中，在达到一定条件的时候让这个直方图打印一下日志。

### 直面 ExponentiallyBucketedHistogram

还是要先看看累的注释的：
这个类是一个直方图，直方图的值都是正数，每个柱是前一个柱的2倍。
表示不太理解

有个属性是整数数组，在构造函数里初始化。

#### 构造函数

这个构造函数够我们好好学习一会了。

``` Java
public ExponentiallyBucketedHistogram(@IntRange(from = 1, to = 31) int numBuckets) {
    numBuckets = Preconditions.checkArgumentInRange(numBuckets, 1, 31, "numBuckets");
    mData = new int[numBuckets];
}
```

首先 @IntRange 是包 android.annotation 中的，这些注释很有用，在 Android Studio 里，在我们传的值不符合规则时，会标出黄线予以警告。这里 @IntRange 声明了参数 numBuckets 取值范围为 1 ～ 31。

接下来，Preconditions 这个类也是一个 Android 内部使用的类，根据名字“先决条件”，可以知道，是做先验检查。这个语句会在检查参数符合要求好正常返回，否则抛出异常。你可能会疑惑，之前的注解不就干这事情吗？并不是，注解只是能让 AndroidStudio 显示提示，程序员在写代码时，可能会忽视它，而这里，直接抛异常，让你无法忽略。而且，注解是在编译时给提醒，在编代码的过程中，就能提示。而这个先验检查则需要在运行时，如果大家都很关注注解的提示，也就不需要这个先验检查了。

#### add

``` Java
public void add(int value) {
   if (value <= 0) {
       mData[0]++;
   } else {
       mData[Math.min(mData.length - 1, 32 - Integer.numberOfLeadingZeros(value))]++;
   }
}
```

负责添加熟知，这里的 value，在 QueueWork 传进的处理一次任务花费的时间。根据注释的说明，在看代码，可以知道，当值小于等于0时都放到第一柱里，否则，否则就比较复杂了。首先得搞清楚  Integer.numberOfLeadingZeros 是个什么鬼？ 看文档发现是看一个无符号整数在二进制是开头有多少个0。这个代码也是很奇妙呀：

``` Java
int n = 1;
if (i >>> 16 == 0) { n += 16; i <<= 16; }
if (i >>> 24 == 0) { n +=  8; i <<=  8; }
if (i >>> 28 == 0) { n +=  4; i <<=  4; }
if (i >>> 30 == 0) { n +=  2; i <<=  2; }
n -= i >>> 31;
```
\>\>\> 是无符号数右移， 使用了二分发，有兴趣的可以研究一下。numberOfLeadingZeros 的注释中说
ceil(log2(x)) = 32 - numberOfLeadingZeros(x - 1)，而在这个代码里，就跟等式右边类似的表达式，这样基本可以知道，那条语句的意思，对于添加的一个值，求他的log2，如果值比数组的最大的桶下标大，就取下表最大值。

而一个整形值，32位，这就是那个幻数的来历了，还记的构造函数的取值范围吗？ 1 ～ 31，也出于这里的原因。为什么呢？

32 位用 log2 来划分，实际有33中取值，0 ～ 32，但是这分桶是看区间，所以是 1 ～ 31。其实细节还是不是很清楚，不过这时候我基本已经理解这个柱状图大体是个怎么个样子了。
![hello](/home/jinux/bitmap.png)

### reset

本来想去看 log() 原来，还有个 reset 方法，虽然很简单，但是也涨了只是，
``` Java
Arrays.fill(mData, 0);
```
如果以前我要做这工作，可能会自己遍历来了。实际这个方法也是想我要做的一样遍历，不过写起来方便嘛。Arrays 里有很多方便的方法，类似的还有 Strings，Collections

### log

log方法用文字来表达了上面图像的内容，使用 StringBuilder 来构建字符串。输出格式类似这样：
``` Java
hello[<1: 200, <2: 300, <4: 100, >=4: 800]
```

到此为止

---
1.  最近在背英语单词呢，又学到了两个单词
2.  Arrays.fill(mData, 0) 填充一个数组
3.  numberOfLeadingZeros() 返回一个整数的二进制时的高位的0的个数
