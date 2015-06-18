---
layout: post
title: Android如何绘制Views（翻译）
categories: Android 翻译
tags: Android view 绘制 viewgroup viewroot
---

当一个*Activity*获得焦点时，会被请求去绘制它的布局.Android 框架回去处理绘制的过程，但是*Activity*必须提供布局的层次结构（Hierarchy）的根节点。  

绘制是从层次结构的根节点开始。根节点被请求去测量（measure）和绘制布局树。绘制过程是遍历这棵树然后绘制与无效区相交的每一个*View*。每一个*ViewGroup*负责请求每个孩子被绘制（使用 *draw()*方法），每个*View*负责绘制自己。因为这棵树是按顺序遍历的，这意味着父亲将会先于或者后于他们的孩子绘制，兄弟之间按照他们在这棵树出现的先后顺序绘制。（译者：这里设计到数据结构里的树的遍历)  

绘制布局的过程分成两遍：一个测量的过程和一个布局的过程。

---
未完待续，敬请期待！！
