---
layout: post
title: OpenGL登堂入室之路-5-画三个三角形
category: 编程
tags: OpenGL
---

看到题目，你可能急了：“画三个三角形？这套路有完没完了？一个，两个，……”，我向大家保证，这套路就到这了，下一篇已经起好了名字：“完全控制颜色”


OpenGL 绘制图像时，并不是像我们自己素描一样，想画什么图形就画什么图形，OpenGL 里有图元的概念，带“元”的表示基本的，OpenGL里的复杂的图形，比如那些复杂的怪兽的模型，都是用一个个图元拼凑起来的。  
OpenGL里的图元有：点，线，三角形，四边形，多边形。  

我们学的是OpenGL ES，之前说过，它是阉割版的OpenGL,　阉割了哪呢？别想歪了，就是缩减了图元的种类：

1. 点（GL\_POINTS)
2. 线 (GL\_LINE\_STRIP, GL\_LINE\_LOOP, GL\_LINES)
3. 三角形 (GL\_TRIANGLE\_STRIP, GL\_TRIANGLE\_FAN, GL\_TRIANGLES)

四边形跟多边形在OpenGL ES没有，因为三角形就可以组成 2D 和 3D 的任意图形了。  

GL\_POINTS 我们最开始就已经见识了，而且还发行，那个点竟然不是个圆点，而是一个方点，仔细想想，其实也没那么神奇，谁说方点不是点了呢？关键是它足够小，否则，像我们那样给他设置那么大的size，根本不像点。[看这里](http://jinguoliang.github.io/2017/02/07/the-way-to-opengl-2.html)  

绘制线有三种方式：

1. GL\_LINES  绘制离散的线段
2. GL\_LINE\_STRIP 绘制链接的线
3. GL\_LINE\_LOOP 绘制闭环的线

动手去试试吧，你一定会惊讶这些概念原来这么容易理解，简单到不用学，动手作实验就能知道它们的区别。
(温馨提示：别忘把颜色着色器里的颜色修改成固定的颜色，更容易看效果）

绘制三角形也有三种方式：

1. GL\_TRIANGLES 绘制离散的三角形
2. GL\_TRIANGLE\_STRIP
3. GL\_TRIANGLE\_FAN

GL\_TRIANGLES 同GL\_LINES，动手试试吧。。。

要讲明白后两种方式，需要知道图形的正反面，而我们要的是有反馈的实验，要想能观察出效果，还需要贴图，牵扯的知识就多了，所以这里先提一提，挖个坑，以后把它填实。

[代码](https://github.com/jinguoliang/RoadToOpenGLOnAndroid/tree/branch-step5)嘛还是有的

---

参考：  
https://www.khronos.org/registry/OpenGL-Refpages/gl2.1/xhtml/glDrawElements.xml
