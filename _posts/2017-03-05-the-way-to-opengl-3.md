---
layout: post
title: OpenGL登堂入室之路3-画两个点
category: 编程
tags: OpenGL
---

本文主要知识点：

1. 如何设置顶点数据
2. OpenGL错误检测
3. OpenGL的坐标系统

## 添加一个顶点的数据

可能有些同学发现我在搞笑，一个点能画，两个点还不简单，你可能同我一样，直接在顶点数组里添加了一个点的三个坐标，一运行，crash  

why?????  

logcat里有报错，但是没有发现什么地方出错了，我们只能根据自己的改动查找相关的地方，修改了顶点数据，不可能导致加载着色器失败，相关语句排除。那就只剩下使用ByteBuffer装载数据（有错就会报出来了），glVertexAttribPointer，glDrawArrays。  

OpenGL的方法在出错的时候不会报异常，而是要我们手动的调用另一个函数 GLES20.glGetError, 它会返回上一条OpenGL方法执行的错误码，通过判断错误码是否为GLES20.GL_NO_ERROR，判断是否上条语句发生错误。我们对他封装一下,在发生错误是报运行时异常：

{% highlight java linenos %}
static void checkGLError(String op) {
	final int error = GLES20.glGetError();
	if (error != GLES20.GL_NO_ERROR) {  // 有错误
	    String msg = op + ": glError 0x" + Integer.toHexString(error);
	    Log.e(TAG, "CheckGLError: " + msg);
	    throw new RuntimeException(msg);  
	}
}
{% endhighlight %}

我们在上面，glVertexAttribPointer() 和 glDrawArrays() 后调用用checkGLError(), 发现是 glVertexAttribPointer() 出了问题。通过错误号，在网上可以查到出错信息，你可以自省搜索，这里我们通过这个错误来学习glVertexAttribPointer()方法

{% highlight java linenos %}
GLES20.glVertexAttribPointer(mPositionHandle, 3, GLES20.GL_FLOAT, false,
                3 * 4 , mVertexBuffer);
{% endhighlight %}

我们已经知道*mPositionHandle*相当于是一个指针，通过它，就可以为着色器中的属性设置值，而这个函数的作用正是规定怎样往着色器传递数据:

1. *mPositionHandle* 指明数据要给谁，这里传的是顶点坐标数据，传给了shader里的vPosition
2. *3* 表示每个顶点传递的一组数据的元素个数，可以是1， 2， 3， 4
3. *GLES20.GL_FLOAT* 表示传递的数据类型为float
4. *false* 表示定点数据值不标准化(我也不知什么意思，若您知道请不吝赐教)
5. 3 * 4 表示要传递的数据的大小, 我们之前传递一个点，每个点的3个float，每个float表示4byte
6. *mVertexBuffer* 最后的一个当然是数据

问题就出第五个参数，参数 3 × 4， 3个float， 代表一个点的数据， 现在，我们在数组又添加了一个点的数据，应该是6 * 4， 再抽象一下，VERTEX.length * 4

现在运行看一下，发现只显示了一个点，为什么？  

竟然也没有报错, 这个咋整，一个问题，之所以是问题，要么是我们掌握的信息不够，或者错误，要么是我们没高清信息之间的关系。好吧，我就不卖关子了，实际同上面的问题差不多。

{% highlight java linenos %}
GLES20.glDrawArrays(GLES20.GL_POINTS, 0, 1);
{% endhighlight %}

这个函数，原先第三个参数是1表示画一个点，现在，传了两个点的数据，要画两个点，所以为2, 如果抽象一下，VERTEX.length / 3

1. GLES20.GL_POINTS 表示绘制离散的点，之后我们会了解到更多绘制模式
2. 0 表示从我们之前提供的数据的第几个点的数据开始画，改成1试试吧[坏笑]
3. 1 表示要绘制几次 尽管我们传了两个点的数据, 但是，如果我们从第0个开始画1个也就只显式一个，所以你懂得

下面是我们有画一个点到画两个点要改动的代码:

{% highlight java linenos %}

private static final float[] VERTEX = {
    0, 0f, 0.0f,
    0.5f, 0f, 0f,
};

GLES20.glVertexAttribPointer(mPositionHandle, 3, GLES20.GL_FLOAT, false,
                3 * 4 , mVertexBuffer);

GLES20.glDrawArrays(GLES20.GL_POINTS, 0, 2);

{% endhighlight %}

## OpenGL 坐标系
看看上面两顶点的数据，它们分别是两个顶点的xyz三个坐标，我们先只考虑二维平面，你可以看到显示的效果，(0, 0, 0)的点在中间，说明原点在屏幕中间。（0.5, 0f, 0f)的点在右侧，说明从原点向有为x轴正方向。
你可以试着改变一下坐标，看一下，很容易得到OpenGL的坐标系：
1. 原点在中央
2. x轴的范围是-1 ～ 1
3. y轴的范围是-1 ~ 1
4. 右上角的坐标为（1,1,0）

剩下一个Z轴坐标系，我相信你能通过自己探索研究出它的规则的。

---
end
