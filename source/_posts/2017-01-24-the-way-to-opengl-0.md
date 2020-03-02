---
layout: post
title: OpenGL登堂入室之路0
categories:
- 编程
tags:
- OpenGL
---

[上一篇](http://jinguoliang.github.io/2017/01/06/opengl-1.html)，我们看见了OpenGL的大门，接下来，我们就开始进入大门，走在了登堂入室之路上  

我打算将这个教程作成一个系列，为什么呢？因为一直以来，在我想去学习Android上使用OpenGL时，除了官方的sample，就是官方sample的翻译，或者类似的博客，画个三角形，或者画个立方体，后来，有了Android平台的系列教程，但是是基于OpenGL ES1.0的，落后了。有一天我找到了[一个教程](http://bullteacher.com/category/zh_learnopengl_com)，它是讲在Windows上开发OpenGL 3.0的教程，它所讲的内容还是比较简明的，但是并不太适合Android开发者，我希望其他Android开发的朋友不会像我一样，再去学习这个教程，所以我打算写一个Andoid平台的全面OpenGL教程。这个过程也是我自己学习的过程，这个过程肯定也是艰辛的，所以希望这条路上有更多的人参与进来，不断改进，完善，使得它成为Android上学习OpenGL的最佳之选。  

我会在github上开一个项目，这个项目是会随着每一篇教程学到的知识而不断长大，完善的，每一篇对应git的一个分支（如果你不了解git，请看[git-简明指南](http://rogerdudler.github.io/git-guide/index.zh.html))  

我们将在Android上使用OpenGL ES，OpenGL ES 是 OpenGL API的删减版本，专门支持嵌入式设备的版本。  

Android现在支持OpenGL ES的几个版本如下：  

1. OpenGL ES 1.0 和 1.1  --  Android 1.0 以上都支持
2.  OpenGL ES 2.0  --  Android 2.2(API 8) 以上都支持 3.  OpenGL ES 3.0  --  Android 4.3(API 18) 以上都支持
4.  OpenGL ES 3.1  --  Android 5.0(API 21) 以上都支持

我们选择 OpenGL ES 2.0 来学习。因为现在它最流行，3.0有些设备部支持，1.0已经落后了。

让我们迈开小步，一点一点成长吧