---
layout: post
title: OpenGL登堂入室之路1--基本框架
category: 编程
tags: OpenGL
---

## 声明　OpenGL ES 版本

这第一篇文章，我们先来构建一个Android项目，它包含了每个OpenGL ES项目必须的东西。
首先在AndroidManifest里添加如下：  

{% codeblock lang:xml %}
<uses-feature android:glEsVersion="0x00020000" android:required="true"/>
{% endcodeblock %}

这里声明了应用需要OpenGL ES版本为2.0。(为什么版本要这样写呢？)  
实际上，这个声明不是必须的，没有它也可以正常运行，他的作用是在Google Play下在应用时，Google Play会根据它，来判断设备是否能够安装该应用，比如你的手机不支持OpenGL ES 2.0，Google Play就不会让你下载该应用。  

## 两个必须

下面开始介绍真正必须的两个东西：

1. GLSurfaceView
2. GLSurfaceView.Render

这一个类，一个接口，就是Android框架支持OpenGL的基础。  
我们现在先了解GLSurfaceView是一个Android 的View，负责显示，而GLSurfaceView.Render从名字我们就知道它是负责渲染的，我们之后所有的工作几乎都在Render里。  
还应该声明的一点是Render的方法都是在另一个线程，即非UI线程来执行的，不会阻塞UI线程。  

## 动起手来
接下来，就开始写代码了：

第一步 先创建一个项目
第二步 在自动生成的布局文件里添加GLSurfaceView

{% codeblock lang:xml %}
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/activity_main"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:paddingBottom="@dimen/activity_vertical_margin"
    android:paddingLeft="@dimen/activity_horizontal_margin"
    android:paddingRight="@dimen/activity_horizontal_margin"
    android:paddingTop="@dimen/activity_vertical_margin"
    tools:context="com.jone.roadtoopenglonandroid.MainActivity">

    <android.opengl.GLSurfaceView
        android:id="@+id/surfaceView"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />
</RelativeLayout>
{% endcodeblock %}

第三步 在对应的Activity里findView，找到GLSurfaceView,并且给它设置Render

{% codeblock lang:java %}
        GLSurfaceView surfaceView = (GLSurfaceView)findViewById(R.id.surfaceView);
        surfaceView.setRenderer(new GLSurfaceView.Renderer() {
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
                GLES20.glClearColor(1f,1f,0f,1f);
                GLES20.glClear(GLES20.GL_COLOR_BUFFER_BIT | GLES20.GL_DEPTH_BUFFER_BIT);
            }
        });

{% endcodeblock %}

### 三个方法

这里我们可以看到，Render接口有3个方法

1. onSurfaceCreated   Surface创建后调用一次
2. onSurfaceChanged GLSurfaceView大小改变时会调用一次，刚创建的时候也会调用一次。
3. onDrawFrame 绘制要显示的每一帧

我给每个方法都加了log，发现onSurfaceCreated 和 onSurfaceChanged的确是调用了一次，而onDrawFrame却不断调用  

### 渲染模式

实际上这个行为是可以改变的，通过surfaceView.setRenderMode来设置渲染的模式：

1. GLSurfaceView.RENDERMODE_WHEN_DIRTY 只在创建和调用GLSurfaceView的requestRender方法时才会导致渲染，即onDrawFrame被调用
2. GLSurfaceView.RENDERMODE_CONTINUOUSLY 见名知意，会持续渲染，说道这我们也知道，GLSurfaceView的渲染模式默认值是RENDERMODE_CONTINUOUSLY

### 来它两句OpenGL尝尝鲜

你可能会发现，onDrawFrame里除了打印log，还调用两个语句。这两个语句就是OpenGL的语句了。  
我们使用OpenGL ES2.0,所以所用使用OpenGL的地方都使用GLES20来调用静态属性或者方法。  
你可能注意到Render的三个方法都有个参数GL10 gl，或许你已经知道，它是OpenGL ES 1.0的用法，忽略它就行了，OpenGL 2.0后都使用静态方法。  

接着说这两个语句：

{% codeblock lang:java %}
GLES20.glClearColor(1f,1f,0f,1f);
GLES20.glClear(GLES20.GL_COLOR_BUFFER_BIT);
{% endcodeblock %}

如果不设置，你可以试试，整个GLSurfaceView都是黑色的。而有这两句则会是黄色。为什么？  
我们首先来说glClear的作用，从名称也可以了解一点它的作用，清空，因为onDrawFrame是多次调用的，如果不调用glClear，则每次绘制的内容都会叠加，这并不是我们期望的，而在每次绘制前glClear，则会清空上次的绘制内容。至于参数，通过标志为来标明要清空的缓存。以后会更深入的了解。  
GLES20.glClearColor(1f,1f,0f,1f);　则决定了每次清空上次的绘制内容后显示什么颜色，参数分别为ｒｇｂａ,每个参数的取值为0~1f, 我们给ｒ，ｇ设置了１，所以是黄色，透明度设置１为不透明。  


好，本文结束。

---

我们的这个教程，需要你的动手做，一定要实践。代码在[这里](https://github.com/jinguoliang/RoadToOpenGLOnAndroid/tree/branch-step1)
