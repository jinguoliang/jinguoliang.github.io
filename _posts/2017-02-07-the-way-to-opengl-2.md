---
layout: post
title: OpenGL登堂入室之路2--画个点
category: 编程
tags: OpenGL
---

## 稍等，扯一扯

OpenGL的学习，门槛就是特别高，因为有太多的概念。本教程的一个任务就是要降低它的门槛，怎么降低呢，就是一小步一小步的走，学习就是得有耐心。  

走一小步，还不行，还得有及时的明显的反馈，所以，效果还得明显，这能做到吗？答案是“不仅能，而且一定能”。  
大多数教程，一开始第一个要画的图形是三角形，原因很简单，因为OpenGL ES对OpenGL绘制图形的方式做了阉割，要绘制三维世界的一个面，最基本的图形就是三角形，但是为什么我们不能简单点，再简单点，绘制一个三维世界的一个点呢，一条线呢。  

## 好的项目从好的结构开始

在我们开始画第一个点时，首先调整一下我们的项目结构，因为之后我们所有的绘制操作全在Render里，所以我们会单独定义一个Render类：MRender  

{% highlight  java %}
public class MRender implements GLSurfaceView.Renderer {
    @Override
    public void onSurfaceCreated(GL10 gl, EGLConfig config) {
        Log.e(TAG, "onSurfaceCreated");
    }

    @Override
    public void onSurfaceChanged(GL10 gl, int width, int height) {
        Log.e(TAG, "onSurfaceChanged");
    }

    @Override
    public void onDrawFrame(GL10 gl) {
        Log.e(TAG, "onDrawFrame");
        GLES20.glClearColor(1f, 1f, 0f, 1f);
        GLES20.glClear(GLES20.GL_COLOR_BUFFER_BIT | GLES20.GL_DEPTH_BUFFER_BIT);
    }
}
{% endhighlight %}

设置Render的地方变成了这样，我们以后几乎所有的工作就是改这个文件了  

别忘了：  

{% highlight  java %}
surfaceView.setRenderer(new MRender());
{% endhighlight %}

另外，还需要在它之前调用：  

{% highlight java %}
surfaceView.setEGLContextClientVersion(2);
{% endhighlight %}

设置OpenGL上下文的版本为2.0，不然以后的操作可能会失败

## 思考在前

我们先来自己想一下，要画一个点，我们首先要有一个三维坐标，还要有一个颜色值，然后就绘制了。  

## OpenGL 的绘制过程

### 三步走

那么在OpenGL里怎么实现呢？如果你还记得在[门外看到](/2017/01/06/opengl-1.html)的，那该多好:

1. 加载顶点数据上传到GPU
2. 加载着色器程序，编译后，上传到GPU
3. 绘制

### 第一步，加载数据
{% endhighlight java %}
    private void loadVertex() {
        mVertexBuffer = ByteBuffer.allocateDirect(VERTEX.length * 4)
                .order(ByteOrder.nativeOrder())
                .asFloatBuffer()
                .put(VERTEX);
        mVertexBuffer.position(0); // Android里OpenGL使用Buffer作为数据，而不是直接使用数组，至于buffer怎么使用以后会有专门的说明
    }
{% endhighlight %}

### 第二步，加载着色器
以上代码实际上使用ByteBuffer包装了一下float数组，Android里OpenGL使用Buffer作为数据，而不是直接使用数组，至于buffer怎么使用以后会有专门的说明  

下面是就是所谓的加载数据并上传到GPU，是调用了我们自定义的两个方法，见名知意：

{% highlight  java %}
    @Override
    public void onSurfaceCreated(GL10 gl, EGLConfig config) {
        Log.e(TAG, "onSurfaceCreated");
        loadVertex();
        loadProgram();
    }
{% endhighlight %}

下面详细说明这两个方法：

{% highlight java %}
    /**
     * 加载程序
     */
    private void loadProgram() {
        mProgram = GLES20.glCreateProgram(); // 创建一个Program对象，此对象非java里的对象，而是OpenGL里的对象，返回一个int值作为该对象的引用
        int vertexShader = loadShader(GLES20.GL_VERTEX_SHADER, VERTEX_SHADER); // 加载顶点着色器，对顶点做处理
        int fragmentShader = loadShader(GLES20.GL_FRAGMENT_SHADER, FRAGMENT_SHADER); // 加载颜色着色器，为什么叫颜色着色器，直译过来应该是片着色器呀？因为主要是作颜色变换
        GLES20.glAttachShader(mProgram, vertexShader); // 将着色器绑定到程序对象上
        GLES20.glAttachShader(mProgram, fragmentShader);
        GLES20.glLinkProgram(mProgram); // 连接，编译程序，为什么编译呢，你一会看到那个C语言代码就知道了。

        mPositionHandle = GLES20.glGetAttribLocation(mProgram, "vPosition"); // 从着色器程序的到属性的位置，从而可以向该属性设置值
    }
{% endhighlight %}

OpenGL里有对象的概念，此对象是一个数据结构，是OpenGL里专有的，并不是Java里的对象。  
以上程序，通知OpenGL创建一个程序对象，并且还会创建两个着色器对象，在着色器对象编译以后，绑定到程序对象，注意，我们并没有操作对象本身，而是使用了一个id，它是OpenGL对象的引用。  
上面方法最后拿到了一个表示着色器程序里一个属性的引用，从而可以在之后向这个属性赋值，很块就能看到了。  

### 第三步，绘制

我们在onDrawFrame函数里：

{% highlight java %}
        // 清空颜色为黑色
        GLES20.glClearColor(0f, 0f, 0f, 1f);
        GLES20.glClear(GLES20.GL_COLOR_BUFFER_BIT);
        GLES20.glUseProgram(mProgram); // 使用程序，  还记的状态机吗？在调用这一句后，OpenGL相关的绘制操作就会基于这个Program

        GLES20.glEnableVertexAttribArray(mPositionHandle); // 刚才的顶点位置属性，先使能
        GLES20.glVertexAttribPointer(mPositionHandle, VERTEX.length, GLES20.GL_FLOAT, false,
                VERTEX.length * 4 , mVertexBuffer);  // 然后向这个属性设置数据，个参数什么意思呢？

        GLES20.glDrawArrays(GLES20.GL_POINTS, 0, 1); // 这里是真正绘制的方法，GLES20.GL_POINTS表示绘制方式为绘制离散的点，而还有其他方式，比如最常用，绘制三角形，我们传三个顶点数据，就会绘制出一个三角形

        GLES20.glDisableVertexAttribArray(mPositionHandle); // 使顶点属性不可用，这也是，状态机的操作

        GLES20.glUseProgram(0); // 还原程序，不在使用mProgram
{% endhighlight %}

### 着色器语言

剩下的还有顶点数据和GLSL语言的两个字符串没有粘出来，着色器，以后会专门讲的，完整代码看git吧  

### 这是个新发现

这个运行效果是屏幕中间一个点，哦，好吧，我错了，是一个矩形，而且很大，为什么呢？因为这个点太大了，为了让大家看清一点，我们在着色器程序里给点设置了100.0的大小值, 而我之前都是设置5的。这里我们发现，原来OpenGL里所说的点，竟然就是个矩形！  

下一篇我们讲两个点，而且是可以设置颜色的。说道颜色，你可能突然想起了什么，为什么这一篇没有设颜色。还是因为保证代码简单。这里我们每次draw的时候清空颜色为黑色，然后是在颜色着色器里设置了点的颜色。不要着急，下一篇肯定讲，我保证：）  

---
