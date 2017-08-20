---
layout: post
title: ByteBuffer for OpenGL
category: 技术
tags: OpenGL nio
---

我们在学习OpenGL时，用到了 ByteBuffer 往 OpenGL 传递数据，虽然这里用法很简单，但是ByteBuffer的用法还是很有意思的，所以打算好好研究一下它。但是限于篇幅，我们打算分几部分来说一说。  
如果你只是学习OpenGL时感觉到困惑，那看这一篇就够了，如果你也同我一样对它产生兴趣，那就愉快的研究一下它吧。

### nio 是什么
ByteBuffer 是 Java 自带 nio 包中的类，nio 包 是（new io）的意思，表示与之前的 io 不同。

nio 主要有三个核心概念： Buffer， Channel， Selector

与原来的 IO 相比，nio 包主要有一下几点不同：

1. 面向缓冲，相比于原先的 IO 的流处理方式， 能够一下读一大块数据，并可以进行一个一个正题的操作。
2. 非阻塞式，一个线程在进行读写操作时，还可以做其他事情。
3. 一个线程，同时处理多个 IO，这整得益于前一个特性。

ByteBuffer 就是那个缓存，通过它，我们可以对需要读写的一块数据进行操作，这里的操作就是读写某一部分数据。
OpenGL 只使用了 nio 中的 Buffer。

### OpenGL 中的栗子

我们在 OpenGL 的学习中，有几处用到了 Buffer，而实际上，真正算用到的地方，只有下面这一处，就是存储顶点数据的这个地方：  
{% highlight c %}
private static final float[] VERTEX = {
            0, 0f, 0.0f,
            0.5f, 0f, 0f,
            0.5f, 0.5f, 0f,

            -0.5f, 0.5f, 0.0f,
            -0.5f, -0.5f, 0f,
    };
private FloatBuffer mVertexBuffer;

。。。

mVertexBuffer = ByteBuffer.allocateDirect(VERTEX.length * 4)  
    .order(ByteOrder.nativeOrder())   
    .asFloatBuffer()
    .put(VERTEX);
mVertexBuffer.position(0);
{% endhighlight c %}

### 自问自答

#### 自问
我们以问题的形式来了解一下它。

1. 为什么使用 ByteBuffer 分配对象，最后却变成了 FloatBuffer？
2. 链式调用，我只到，可为什么断开了？

#### 自答

1. 第一个问题，原因就在 asFloatBuffer()，它将 ByteBuffer 变成了 FloatBuffer。可是为什么， 我臆测一下，我们分配的是一个 ByteBuffer 底层数据是byte，效率更高。但是 Byte 数据当做做　Float数据使用，每个数据的占的空间大小都不同，首先面临的一个问题就是大端，小端的问题，而这个问题使用  .order(ByteOrder.nativeOrder())  解决了。在将它转变成　FloatBuffer 后, 最后才放入了　float 数组。

2. 第二个问题的答案，其实了解链式调用了很简单，链式调用的原理是，在调用一个方法后，在执行完相应的操作后，将自己的对象返回了。这么说来上面的栗子的链式调用很不规范，因为它这个链在调用过程中类型都变了。而　position 之所以单独调用，是因为它返回的　Buffer 类型，而我们想要的是　FloatBuffer, 仅此而已。你可能会说，做个强制转型不就可以了———的确是，哈

总的来说，上面的语句的意思是　分配一个　ByteBuffer　对象，然后设置它为按照本地的顺序读写，然后把它编程　FloatBuffer，于是可以把 Float　数组的数据放进去。最后，最后把 position 设置为０。　　

而之所以要设置　position, 着牵扯到 Buffer 的使用方法，它有个指针，指示当前的读写位置，而我们在调用　put　的时候，就是在对　Buffer　进行写操作，所以我们要对它初始化成０。而对于 Buffer 更深入的了解，请听下集分解。
