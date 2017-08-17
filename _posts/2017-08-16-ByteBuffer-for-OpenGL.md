---
layout: post
title: ByteBuffer for OpenGL
category: 技术
tags: OpenGL nio
---

ByteBuffer for OpenGL

我们在学习OpenGL时，用到了ByteBuffer来往OpenGL传递数据，虽然这里用法很简单，但是ByteBuffer的用法还是很有意思的，所以打算好好研究一下它。但是限于篇幅，我们打算分几部分来说一说。
如果你只是学习OpenGL时感觉到困惑，那看这一篇就够了，如果你也同我一样对它产生兴趣，可以好好研究一下。

### 闲话少说，贴出例子

mVertexBuffer = ByteBuffer.allocateDirect(VERTEX.length * 4)
 .order(ByteOrder.nativeOrder()) 
.asFloatBuffer()
.position(0); 

### 挨个语句解释

大题讲解是什么
优点
大小端
快
链式调用