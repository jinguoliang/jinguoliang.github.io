---
layout: post
title: Android如何绘制Views（翻译）
categories: 编程 翻译
tags: Android View ViewGroup ViewRoot
type: 翻译 Android
---

当一个*Activity*获得焦点时，会被请求去绘制它的布局.Android 框架回去处理绘制的过程，但是*Activity*必须提供布局的层次结构（Hierarchy）的根节点。  

绘制是从层次结构的根节点开始。根节点被请求去测量（measure）和绘制布局树。绘制过程是遍历这棵树然后绘制与无效区相交的每一个*View*。每一个*ViewGroup*负责请求每个孩子被绘制（使用 *draw()*方法），每个*View*负责绘制自己。因为这棵树是按顺序遍历的，这意味着父亲将会先于或者后于他们的孩子绘制，兄弟之间按照他们在这棵树出现的先后顺序绘制。（译者：这里设计到数据结构里的树的遍历)  

绘制布局的过程分成两遍：一个测量的过程和一个布局的过程。测量的过程是通过*measure(int, int)*实现，自顶向下遍历*View*.在递归的过程中，每一个*View*把自己的尺寸规格向下传递。测量完后，每个*View*都存储了自己的测量结果。布局的过程通过方法*layout(int, int, int, int)*实现，也是自顶向下的过程。在这个过程中，每一个父view负责根据测量过程中的大小来放置子view。  

当一个*View*对象的*measure（）*方法返回后，它的* getMeasuredWidth()*和*getMeasuredHeight()*的值必定被设置好了，根据上文的绘制过程，它的后裔也应如此（递归）。一个*View*对象的测量的宽度和高度受父View的限制。这保证了在测量完成后，所有的父View都能接受子View的测量结果。一个父View可能会调用多次子View的*measure（）*方法。比如，父View会先用*unspecified dimensions*对每一个子View测量一次来找出每个子View想要的尺寸。然后如果所有子View的非限制的尺寸和太大或者太小时，父View会再次调用*measure()*。（也就是说，如果子View自己不能获得自己需要的尺寸，父View就会在布局过程中对其进行干涉施加限制）。  

测量的过程使用了两个类来传递尺寸：*ViewGroup.LayoutParams* 和 *MeasureSpec*  
子View使用*ViewGroup.LayoutParams*来告诉父View如何测量和放置自己。*ViewGroup.LayoutParams*是个基类，只描述了*View*的宽高，每一个尺寸的值可以使用如下一个：  

* 一个精确的值
* *MATCH_PARENT* 标识子View想要同父View一样大
* *WRAP_CONTENT* 标识子View要求尺寸干好包含内容就可以（包括padding）

*ViewGroup*的不同的子类会定义自己的LayoutParams继承自*ViewGroup.LayoutParams*。比如，*RelativeLayout*有自己的LayoutParams，能够让子View横向或竖向居中。  

*MeasureSpec* 对象用来从父View向子View传递要求。可以是如下三种模式：  

* *UNSPECIFIED* 父View通过它来确定子View想要的尺寸。比如，一个*LinearLayout*以高度为*UNSPECIFIED*，宽度为240来调用*measure()*,目的是要得到子View的高度，并且设置它的宽度为240px。
* *EXACTLY* 精确设置一个尺寸，子View必须保证自己和后裔都要使用这个精确的值
* *AT MOST* 设置一个最大值，子View必须保证自己和后裔不能超过这个尺寸

---
未完待续，敬请期待！！  
Fri Jun 19 00:08:56 CST 2015 翻译完了，但略显生硬，应该润色一下。
