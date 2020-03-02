---
layout: "post"
title: "QueuedWork"
date: "2018/06/10 21:36"
categories:
- 编程
tags:
- SharedPrefenrences
- Android
- 源码
---

[QueuedWork源码](https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/app/QueuedWork.java)

这是一个内部工具类，也就是说不会暴露 API，我们不能使用，但是我们可以从这里开始学习呀！

下面，我们先来翻译一下它的类注释
> 这个内部类用来追踪进程全局的待执行的任务
> 新的任务，会被入队列
> 还可以添加 'finisher'-runnables，会保证这些 finisher 在任务完成后执行
> 这个类是为了解决 SharedPrefenrences 一部保存而写的，我们会在 Activity.onPause 等类似的周期函数里等待保存任务完成。
> 但是我们未来也可能会把该类用到其他地方
> 入队的异步任务会在单独的专门的线程执行

对于一个陌生的东西，它可能有很多我们不知道的东西，某些可能我们缺少相关的基础只是，而另一些则是因为缺少上下文，所以，我们一开始，我们只从这个源码着手，先去认识了解那些我们知道的，采取农村包围城市方针，一点一点攻克，最后剩下的是需要外面的知识。

### LOG_TAG
使用类的 simpleName 赋值，之前技术Leader说这样会有问题，我所了解的一点是 TAG 的长度有限制，至今还不知道有什么问题。

### DEBUG
用来打印一些 debug 的 log，我们应用里，直接封装了打印日志的函数，在这些函数里面进行判断，感觉更好一些。

### DELAY？？？？

### MAX_WAIT_TIME_MILLIS
最大等待时长，根据注释，只是为了打印一个 warning，在等待任务完成时，会记录消耗的时长。

### sLock 和 sProcessingWork
是这个类里面的两个锁

sLock 是这个类的锁，各种操作都需要用这个锁同步
sProcessingWork 是为了保证同时只有一个线程处理任务队列，因而保证任务执行的顺序是添加的顺序。因为整个任务队列执行的事件都被锁住，所以使用单独的锁，一遍可以执行其他操作。

在方法中详细聊

### sFinishers

整个变量是需要执行的 Finisher，也就是任务都执行完后，要执行的操作。
注释很棒，来看看
``` Java
/** Finishers {@link #addFinisher added} and not yet {@link #removeFinisher removed} */
```
是添加了的，还没有移除的 Finishers，一块说明了两个操作 addFinisher 和 removeFinisher，它俩实现很多简单就是队列表元素的添加和删除，添加了同步。
学习了  {@link #method hint} 注释中的 mark 的使用
还要注意到一个注解

### @GuardedBy("sLock")

只是指示作用， 比注释简洁，明确的说明被它修饰的方法或属性在访问前需要先获取 sLock的锁

一眼看下去，发现 sFinishers， sHandler， sWork， sCanDelay， mWaitTimes 都需要 sLock 是这个锁

### sHandler
通过 getHandler() 实现懒创建，还是个单例

``` Java
private static Handler getHandler() {
    synchronized (sLock) {
        if (sHandler == null) {
            HandlerThread handlerThread = new HandlerThread("queued-work-looper",
                    Process.THREAD_PRIORITY_FOREGROUND);
            handlerThread.start();
            sHandler = new QueuedWorkHandler(handlerThread.getLooper());
        }
        return sHandler;
    }
}
```

我们发现是使用 HandlerThread，创建一个新线程， 初始化的时候原来不仅要设置名称，还可以设置优先级 Process.THREAD_PRIORITY_FOREGROUND。
接着启动它后，实例化了一个 QueuedWorkHandler 对象，这是一个很正常的通过 HandlerThread 来创建消息队列的流程。
QueuedWorkHandler 是个内部类

``` Java
private static class QueuedWorkHandler extends Handler {
  static final int MSG_RUN = 1;
  QueuedWorkHandler(Looper looper) {
      super(looper);
  }
  public void handleMessage(Message msg) {
      if (msg.what == MSG_RUN) {
          processPendingWork();
      }
  }
}
```
这个类是个私有静态内部类，顶一个了一个 MSG_RUN, 实现 handleMessage 仅仅是针对 MSG_RUN 来调用处理未处理的工作。processPendingWork(); 是核心，我们最后说。

### sWork

不必多说，这就是未处理的工作队列。通过 queue 向里面添加工作

### sCanDelay？？？

### mWaitTimes 和 mNumWaits？？？

### 全是静态属性，静态方法

我才发现，这个类原来所有的方法属性都是静态的。只能算个工具类。

### queue
入队一个任务，并且通知工作线程处理，这里还有参数 shouldDelay，跟 sCanDelay 配合决定是否延时通知线程处理，我不太理解为什么需要延时处理。

hasPendingWork 只是返回队列是否为空

好，只剩下两个方法

### processPendingWork

之前在阅读 QueuedWorkHandler 的代码时，提到过它，我们大体知道了 QueueWork 的核心逻辑了，在入队一个任务时，会发消息给执行线程，而 handler 收到消息就会处理，怎么处理呢，就是交个 processPendingWork 处理

``` Java
synchronized (sProcessingWork) {
  LinkedList<Runnable> work;
  synchronized (sLock) {
      work = (LinkedList<Runnable>) sWork.clone();
      sWork.clear();
      // Remove all msg-s as all work will be processed now
      getHandler().removeMessages(QueuedWorkHandler.MSG_RUN);
  }
  if (work.size() > 0) {
      for (Runnable w : work) {
          w.run();
      }
  }
}
```

这里用了两个锁，可以从中学习到很好的同步写法。先说 sLock，首先将 sWork 克隆到本地变量 work，然后清空 sWork，在移除 MSG_RUN，则一些列保证原子性，就像其他对 sWork的操作一样。之前在说 sProcessingWork 时已经说过，它的作用是保证处理任务的顺序按照入队的顺序。怎么保证的呢，work里的按顺序遍历自不必多说，关键是在执行完 sWork 想 work 的克隆后，如果来了任务，而且还在另一个重入该方法，如果没锁，那就是在两个线程里分别遍历两个列表，这顺序肯定不能保证。而有了 sProcessingWork，这种情况就解决了。


之前已经提到处理任务时会计时，是为了 debug 的，直接忽略掉了。

### waitToFinish

不知你有没有发现一个问题， processPendingWork 如果只是在 QueuedWorkHandler 里调用，那一定在一个线程里，也就不需要之前的同步了。这里就解决了这个疑问， waitToFinish 一个公开得方法，它直接调用了 processPendingWork 方法，所以还是会被其他线程执行的。

该方法首先一处 MSG_RUN，然后处理未处理的工作，最后处理掉所有 Finisher，我们忽略了 debug 的操作。

#### 移除 MSG_RUN
这很好理解，因为接下来就出列悬而未决的任务了，所以没必要通知工作线程去处理了。

sCanDelay 设成 false，因为在这个方法里必须将所有悬而未决的任务处理掉，所以就不需要 delay 了，之前说过不明白为什么 delay，先在觉得可能就是为了在最后这一刻能够集中处理一下，额，太牵强了。

#### StrictMode

一看名就感觉很高级，完全不知所云， 但但是说出它的作用你就知道了它是什么了。我们知道在 UI 线程不能做好事操作，比如读写磁盘 和 网络请求。使用 StrictMode 可以检测到这种操作，并且你可以制定要做如何的相应。

StrictMode.allowThreadDiskWrites(),
是一个提供方便的方法，他会设置允许写磁盘操作，因为我们的保存配置的操作是写操作，同时，会返回当前的 ThreadPolicy，代码中会保存原来的策略，在执行完任务后再还原。

#### 清理掉 Finisher
最后，可以看到，使用了一个死循环，不断的从列表里 poll 出 Finsiher，只有没有了，返回 null 才退出死循环。

#### 这个方法在哪调用

这个方法会在 Activity 的 onPause(), Broadcast 的 onReceive, 在服务处理了 command 后，总之保证悬而未决的任务处理掉。

这里就可以发现一个问题，这个方法是会阻塞UI线程的， 所以，任务要尽量少，任务工作量也应该尽量小。具体到保存配置，就是不要太频繁的 apply，配置的内容尽量少。



---
1.  第一个提高的能力，翻译
2.  {@link #method hint}
3.  @GuardedBy("sLock")
4.  StrickMode
5.  同步策略
6.  死循环不断 poll，检测到null退出循环
7.  IntnetThread， Handler 的使用