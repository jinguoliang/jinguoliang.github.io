---
layout: post
title: OpenGL登堂入室之路4-画三个点
category: 编程
tags: OpenGL
---

我们画了一个点，两个点，接着画三个点，有些小伙伴可能想到要画三角形了，的确如此，而且是带颜色的三角形。

本文知识点：

1. 画三角形
2. 给每个点设置不同的颜色
3. 初步了解GLSL，连个变量的两种修饰符

在开始之前，希望小伙伴，自己加上第三个点，我相信你能做到的。

好了吗？好，按找题目所表达的，今天完成任务了，小伙伴出去玩吧，哈哈

但是我们要画三角形呀，三角形呀

好，告诉你，只要修改一个地方，我觉的你也能猜到，不过我偏偏告诉你，就不给你留自己思考的时间。如下：

{% codeblock lang:java %}
GLES20.glDrawArrays(GLES20.GL_TRIANGLE_FAN, 0, 3);  
{% endcodeblock %}
or  
{% codeblock lang:java %}
GLES20.glDrawArrays(GLES20.GL_TRIANGLE_STRIP, 0, 3);  
{% endcodeblock %}
or:  
{% codeblock lang:java %}
GLES20.glDrawArrays(GLES20.GL_TRIANGLES, 0, 3);
{% endcodeblock %}

它们都是告诉OpenGL绘制三角形，只不过绘制方式有区别，具体什么区别，我们会在下一篇绘制多个三角形的时候研究，因为一个的时候看不出来。(一不小心下一预告就出来了)

画三角形，轻松愉快就完成了，三角赢得颜色是cyan，这个颜色我挺喜欢，最近才知道它原来是有，绿色和蓝色混合成的，而绿色和蓝色我都很喜欢，这叫什么呢？我们接下来要将给三个点设置不同的颜色了，在颜色着色器代码里，还记得吗？

{% codeblock lang:c %}
private static final String FRAGMENT_SHADER = "precision mediump float;\n"
    + "void main() {\n"
    + "  gl_FragColor = vec4(1,0,1,1);\n"
    + "}";
{% endcodeblock %}

在这里，vec4(1,0,1,1) 是一个四维向量，分别为argb, 着色器是对每个点都作相同的处理的程序，所以就不能分别给每个点设置不同的颜色了，那怎么办呢？
我们的顶点位置数据就是三个点分别设置的呀，对了，也要传进来
怎么传呢，照葫芦画瓢，但是这着色器语言实在是有点似曾相识又陌生，像C却不是C，不要着急，我们一点点的学习，立马学一点：

> vec4(1,0,1,1)  是一个四维的向量，还有vec3(三维向量)，vec2(二位向量)

我们看看顶点着色器：

{% codeblock lang:c %}
"attribute vec4 vPosition;\n"
{% endcodeblock %}

对应着，在OpenGL里是：

{% codeblock lang:java %}
mPositionHandle = GLES20.glGetAttribLocation(mProgram, "vPosition");
{% endcodeblock %}

我们得到一个代表vPosition的东西mPositionHandle， 然后对它做出里，那是不是可以也声明一个类似的东西，在OpenGL取得它的代表，然后向它传递数据呢？当然是可以的。
我们先来看看那个声明语句，它是声明了一个变量vPosition，它的类型是vec4，这我们知道，为什么前面还有一个attribute， 看这个函数glGetAttribLocation，有Attrib，尽管它不完整，我们也知道它就是attribute。什么意思呢？
看这里：
https://www.khronos.org/registry/OpenGL/specs/gl/GLSLangSpec.1.20.pdf
全英文，那要不看这里：
https://my.oschina.net/sweetdark/blog/208024

attribute 修饰的变量，有三个特点

1. 从OpenGL里传入
2. 只读
3. 只能在顶点着色器出现，颜色着色器里就不能声明了

第一点，我们见识了，第二点我们先记住啦，第三点好像打破了我们美好的愿望呀，我们想在颜色着色器里使用呀，怎么办呢？

还要引入另一个变量的修饰符 varying
varying 有两个特点：

1. 在顶点着色器里可读写，在颜色着色器里只读
2. 顶点着色器和颜色着色器，都声明相同名字的变量，从而可以将数据从顶点着色器传给颜色着色器

了解了这两个修饰符，上代码：

{% codeblock lang:java %}
private static final String VERTEX_SHADER = "attribute vec4 vPosition;\n"
    + "varying vec4 vColor;\n"
    + "void main() {\n"
    + "  vColor = vPosition;\n"
    + "  gl_Position = vPosition;\n"
    + "  gl_PointSize = 100.0;\n"
    + "}";
private static final String FRAGMENT_SHADER = "precision mediump float;\n"
    + "varying vec4 vColor;\n"
    + "void main() {\n"
    + "  gl_FragColor = vColor;\n"
    + "}";
{% endcodeblock %}

首先我们看到，两端代码里都有这一句：

{% codeblock lang:c %}
varying vec3 vColor
{% endcodeblock %}

对，它就是在两个着色器之间传递颜色数据的变量。

另外还有两句是赋值语句，我相信你会明白的, 这里我们为了简单起见，直接把顶点的坐标作为颜色数据，运行后你可以看到三角形三个顶点分别是，黑色（0,0,0)，红色(0,0.5,0)，黄色(0.5,0.5,0), 让人惊奇的是三角形竟然被填充了，三个点之间颜色渐变，还挺漂亮，是吧？这是OpenGL的特性，这里的原理嘛，是这样：

> OpenGL在渲染三角形图像时，会作一步一步的处理，有好多步，我们现在只见识了顶点着色器和颜色着色器，它们都是这一步一步处理中要执行的。在像素化阶段，通常会生成比顶点更多的像素，每个像素就会挨个传递自己数据到顶点着色器，而它们的坐标是它们基于三角形中的位置的。不仅位置坐标基于像素在三角形中的位置，颜色也同样，比如我们有一个线段，A顶点的颜色为绿色，B顶点的颜色为红色，则在线段上距离A 20%的点的颜色值将会是80%的绿色，20%的红色

加餐：
我们这一次，修改了着色器语言，对它不熟悉，而且也没有ide提醒，所以很容易出错，而且呢，出错也没有log的，简直无从下手呀! 其实OpenGL提供了打印编译错误的：

{% codeblock lang:java %}
GLES20.glLinkProgram(mProgram); 
IntBuffer result = IntBuffer.allocate(1);
GLES20.glGetProgramiv(mProgram, GLES20.GL_LINK_STATUS, result);
Log.e(TAG, "loadProgram: " + result.get(0));
if (result.get(0) == 1) {
    Log.e("glGetProgramInfoLog", GLES20.glGetProgramInfoLog(mProgram));
}
{% endcodeblock %}

我们在glLinkProgram后，调用了glGetProgramiv，它会获取到着色器程序的编译状态，然后又用glGetProgramInfoLog，获取到了编译log，这样，我们就可以快乐的找错误了。
再多说一点，glGetProgramiv的第三个参数使用了IntBuffer，因为OpenGL低层是C++，按照它的风格，会把结果从参数返回来，我们适应一下吧。IntBuffer以后会讲到

---
好的，over
