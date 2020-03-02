---
layout: post
title: 阅读代码：AsyncTask
categories:
- 编程
tags:
- Android
---

* 阅读代码系列的文章都是我阅读代码过程中记录下来的只言片语，读者可能需要对照着代码来看才能看懂。  
如果对您要帮助我会非常的高兴！！
* 看代码先了解这个段代码是如何用的非常重要,原因很简单，你只有知道熟知了它的用处，才能在看到它的实现时对此产生共鸣（难怪那样使用！！这样像是为了那样使用的！！原来是这样！！），如果要是以提问的形式写出来就更好了。

## API-21
## AsyncTask的使用
1. 我们使用AsyncTask一般都是继承它，然后重新实现几个生命周期，然后实例化它并执行execute（）
2. onPreExecute（） --> doInBackground()(新线程）--> onPostExecute（）
3. 当在doInBackground（）里执行publishProgress（）时在新线程里会调用onProgressUpdate

## 基本属性
1. CPU_COUNT   = Runtime.getRuntime().availableProcessors();
2. CORE_POOL_SIZE, MAXIMUM_POOL_SIZE根据cpu数量算出 KEEP_ALIVE = 1
3. ThreadFactory 使用了AtomicInteger计数线程个数，保证每个线程都有个唯一的名字
4. BlockingQueue<Runnable> 待执行的任务队列
5. ThreadPoolExecutor 并行的执行任务，用到了所有上面的东西来构造这个执行器
6. SerialExecutor 串行执行器，对特定进程是唯一。  使用ArrayDeque<Runnable>，在执行时先包装runnable保证执行完这个任务后再执行下一个，然后使用offer添加到队列结尾，最后如果没有正在运行的任务则运行任务。scheduleNext是从任务队列里取一个任务然后放到THREAD_POOL_EXECUTOR里执行。
7. 两个消息：MESSAGE_POST_RESULT 和 MESSAGE_POST_PROGRESS
8. InternalHandler 内部处理器，接受上面两个消息，做相应的处理。使用了AsyncTaskResult，封装了asynctask实例和数据
9. sDefaultExecutor = SERIAL_EXECUTOR;  volatile？？？它有什么用真心不太了解！！
10. 以上全是静态的。类所拥有的
11. 真正的工作者WorkerRunnable<Params, Result> mWorker；实现了Callable，包含参数数组返回结果。
12. FutureTask<Result> mFuture;？？
13. Status mStatus 状态
14. enum Status：  PENDING, RUNNING, FINISHED
15. 两个原子变量：AtomicBoolean mCancelled， mTaskInvoked

## 构造函数

1. 实现一个WorkerRunnable  
	a. mTaskInvoked.set(true); 标识task被调用,这是个原子操作  
	b. 设置优先级为后台  
	c. postResult(doInBackground(mParams)); postResult会从sHandle取得message并传给它数据，然后发送给handler
2. 实现一个FutureTask，在执行完成后postResultIfNotInvoked（get（））？？？？？

## 执行逻辑execute()
1. execute → executeOnExecutor(使用默认的执行器） →   
		1. 如果状态不是pending而是正在执行或完成，则报错，一个task只能执行一次  
		2. 设置为正在执行然后调用onPreExecute();  参数传给worker，执行器开始执行future。  
2. 调用了默认的执行器的execute，就是那个串行执行器（虽然每个task只能执行一次，但是这个执行器是属于累的，也就是说所有的task都会被放到一个执行器一个线程上执行）  
3. 如前所述，串行器会将任务放到一个队列上，并且从头取任务执行。它就是序列化任务，真正执行的是THREAD_POOL_EXECUTOR  是他开启了新线程，并行工作
4. 这时候THREAD_POOL_EXECUTOR执行的是什么呢？
		1. new Runnable() {r.run(); scheduleNext();}
		2. r 就是传进来的 Future，构造函数里初始化的那个，构造它时传进了worker

## publishProgress()报告进度
1. 向handler发送Progress信息，并传递数据AsyncTaskResult
2. handler是在主线程的，所以就可以直接调用主线程的onProgressUpdate

想看更多关注我的blog：http://jinguoliang.github.io

2020年评论：  
都忘记了自己曾经写过这个，要复习呀，要重复呀，那时候，没有这种能力，现在有了点
