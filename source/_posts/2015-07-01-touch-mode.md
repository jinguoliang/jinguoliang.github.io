---
layout: post
title: <翻译> 触摸模式(Touch Mode)
categories:
- 翻译
tags:
- Android
---

为Android设计和开发用户接口与普通的桌面环境有很大不同.因为Android运行在手机设备上,应用设计者和开发者必须处理大量的约束,而这些约束并不总是很明显.为了帮助你开发和设计更好的应用,我们正在发布一些关于用户接口的文章.在这个系列里,我们会向你介绍一些设计指导和工具,开发技巧并解释Android UI工具套件的基本原则.我们的目的很简单:帮助你去设计和开发好的用户体验.一开始,我想先介绍*触摸模式*,它是UI工具套件最重要的原则.  
*触摸模式*是*view hierarchy*的一种状态,它只受用户与手机交互的影响.单独来看,*触摸模式*是很容易理解的,它指示了用户最后一次交互是否是触屏操作.比如,当你使用G1手机时,用滚迹球选择一个*widget*会退出*触摸模式*,而当用手机点击屏幕上的按钮时又会进入*触摸模式*.当用户不在*触摸模式*时,可能会在*滚迹球模式*(tackball mode),*导航模式*(navigation mode)或者*键盘导航*(keyboard navigation).还有,与*触摸模式*直接相关的唯一的api是[View.isInTouchMode()](http://code.google.com/android/reference/android/view/View.html#isInTouchMode%28%29).  
听起来很容易对吗?奇怪的是,触摸模式是大幅简单而进入触摸模式的后果远远超过你的想象。让我们看看一些原因
##触屏模式,选项(Selection)和焦点(Focus)
为手机设计UI工具套件是困难的,因为它们要提供各种交互机制.有的设备只提供12个按键,有的会有触屏,有的需要触摸笔,有的既有触屏又有键盘.这样来看,第一款商业手机G1对Android开发者社区来说是一项福利,因为它提供了多种形式的输入:触屏,滚迹球和键盘.因为用户可以使用三种不同的机制来与应用交互,我们不得不努力解决所有可能出现的问题.  
以ApiDemo为例,它显示一个文本项列表.用户可以通过滚迹球来导航这个列表,也可以通过手指来滚动这个列表.这时,*选项*是一个问题.如果我选择了列表顶部的一项,然后向上滑动列表,选项应该如何变化呢?它依然要在那一项上并滑出屏幕吗?这时,如果我又要用滚迹球来移动选项会发生什么?更糟糕的,如果我按下滚迹球来给予当前的选项来触发动作,而此时选项并没有显示在屏幕上,这时候又会发生什么?在仔细考虑后,我们决定移除选项(在触屏模式).  
在触屏模式, 没有焦点和选项.一旦用户进入触屏模式,被选项不在被选中.相似的,当用户进入触屏模式,获取焦点的控件不再拥有焦点.下面的图片演示了当用户用滚迹球选择了一项后,再点击触屏,应用的反应.  

![has-selection](/public/img/list02.png)
![no-selection](/public/img/list01.png)

为了让用户觉得更自然,当用户离开触屏模式时,框架知道怎样恢复选项/焦点.例如上边的例子,如果用户又使用滚迹球,先前的选项又会被选中.这就可以解释一个让开发者困扰的事情:他们创建的自定义view只有在滚动一次滚迹球后,才能接受按键事件.原因就是他们的应用处于触屏模式,需要使用滚迹球退出触屏模式,恢复焦点.  
触屏模式,选项和焦点的关系意味着你不能确定选项/焦点是否一定存在.一个初学者常犯的错误是依赖[ListView.getSelectedItemPosition()](http://code.google.com/android/reference/android/widget/AdapterView.html#getSelectedItemPosition%28%29).在触屏模式,这个方法将会返回[INVALID_POSITION](http://code.google.com/android/reference/android/widget/AdapterView.html#INVALID_POSITION).你应该使用[click listeners](http://code.google.com/android/reference/android/widget/AdapterView.html#setOnItemClickListener%28android.widget.AdapterView.OnItemClickListener%29) 或者 [choice mode](http://code.google.com/android/reference/android/widget/ListView.html#setChoiceMode%28int%29).  
## 在触屏模式可获取焦点
现在,你知道在触屏模式焦点是不存在的,我必须声明这并不完全正确.Focus在触屏模式可以存在但是以一种非常特别的方式,我们叫它可获取焦点的.这种特殊的模式是为接受文本输入(如EditText)或者具有过滤功能(如ListView)的控件创造的.这就是为什么在向文本框输入文本之前不必首先用滚迹球或手指选中它.当用户点击屏幕,如果应用没有在触屏模式将会进入触屏模式.在进入触屏模式的过程中会发生什么取决于用户点击了什么和焦点在哪.如果用户点击了一个在触屏模式可获取焦点的控件,这个控件将会获取焦点.否则,现在获取焦点的控件如果在触屏模式不能获取焦点就会失去焦点.例如,在下边的图片中,当用户点击屏幕时,输入框会获取焦点.  

![text-field](/public/img/text_field.png)

在触屏模式是否可以获取焦点是view的一个属性可以通过代码或者xml设置,设置时应该谨慎,因为它破坏了与Android正常行为的一致性.游戏和全屏的地图是一个设置这个属性的很好的例子.
下边是一个需要在触屏模式获取焦点的控件的例子.当用户点击AutoCompleteTextView的Suggestion时,焦点依然在输入框.

![search01](/public/img/search01.png)

Android初学者经常会通过设置触屏模式下的获取焦点能力来"修复"不显示选项/焦点.我们希望你考虑清楚.如果使用不正确,你的应用会与系统行为不同,让用户非常不习惯.Android框架包括了所有你需要的工具来处理用户交互,你完全可以不在触屏模式设置控件的可获取焦点性.比如,简单的使用[choice mode](http://code.google.com/android/reference/android/widget/ListView.html#setChoiceMode%28int%29),而不是让ListView保持它的选项.如果Android框架不适合你的需求,你可以向我们[提意见](http://code.google.com/p/android/issues/list)或者[提交你的patch](http://source.android.com/).  
##触屏模式的备忘录
应该这样:

- 与核心应用保持一致
- 如果你想保持选中状态,使用它们适当的特性(radio button, check box, ListView的选项模式)
- 如果是写游戏,使用(focusable in touch mode)

不应该: 

- 不要在触屏模式保持选中状态或者保持焦点.


---
