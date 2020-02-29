---
layout: "post"
title: "从源码来看 SharePreference"
date: "2018-05-27 11:12"
category: 编程
tags: SharedPreferences Android 存储
---

SharePreference 是 Android 应用保存配置的类，保存键值对，它的使用还是比较简单的，我们只需要跟三个接口打交道：

1. SharedPreferences 负责读取配置(getXXX())，从 Context#getSharedPreferences 获取对象
2. Editor 负责保存配置(putXXX()), 最后要使用 (apply/commit 提交配置)，从 SharedPreferences.editor 获取对象
3. OnSharedPreferenceChangeListener 负责监听配置变化，需要传给 SharedPreferences

需要特别注意的是，SharePreference 特别声明该类不支持跨进程。在老版本是允许的，是一个坑。

## 获取 SharedPreferences 对象
Contex 的实现类 [ContextImpl](https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/app/ContextImpl.java)

在 getSharedPreferences(String name, int mode) 方法里：
``` Java
synchronized (ContextImpl.class) {
    if (mSharedPrefsPaths == null) {
        mSharedPrefsPaths = new ArrayMap<>();
    }
    file = mSharedPrefsPaths.get(name);
    if (file == null) {
        file = getSharedPreferencesPath(name);
        mSharedPrefsPaths.put(name, file);
    }
}
```

这里使用 synchronized 防止并发访问 mSharedPrefsPaths 这样每个线程得到的都是相同的 mSharedPrefsPaths，并能根据 name 获取到自己正确的文件名。getSharedPreferencesPath 会根据 name 生成文件路径。我们跟进这个方法发现配置文件保存目录为 data/shared_prefs。

继续，进到重载方法 getSharedPreferences(File file, int mode) 方法里：

``` Java
synchronized (ContextImpl.class) {
  final ArrayMap<File, SharedPreferencesImpl> cache = getSharedPreferencesCacheLocked();
  sp = cache.get(file);
  if (sp == null) {
      checkMode(mode);
      if (getApplicationInfo().targetSdkVersion >= android.os.Build.VERSION_CODES.O) {
          if (isCredentialProtectedStorage()
                  && !getSystemService(UserManager.class)
                          .isUserUnlockingOrUnlocked(UserHandle.myUserId())) {
              throw new IllegalStateException("SharedPreferences in credential encrypted "
                      + "storage are not available until after user is unlocked");
          }
      }
      sp = new SharedPreferencesImpl(file, mode);
      cache.put(file, sp);
      return sp;
  }
}
if ((mode & Context.MODE_MULTI_PROCESS) != 0 ||
  getApplicationInfo().targetSdkVersion < android.os.Build.VERSION_CODES.HONEYCOMB) {
  // If somebody else (some other process) changed the prefs
  // file behind our back, we reload it.  This has been the
  // historical (if undocumented) behavior.
  sp.startReloadIfChangedUnexpectedly();
}
```
我们发现，有做了一个 缓存，之前是 name -> File, 现在是 File -> SharedPreferencesImpl, 同样进行了同步。下面对存储加密并且没有解开的情况抛异常，接下来的一个判断解决了我们开头的那个 “特别注意”， 我们忽略了一个参数 mode，这个参数有一个可选值为 Context.MODE_MULTI_PROCESS， 在 HONEYCOMB 之前，其他进程在我们之后修改了配置，我们会重新加载它，先在不做处理，也不推荐使用这个参数了。

这样，我们得到了 SharedPreferencesImpl 的对象。

## 如果要我去实现一个 SharedPreferences

接口已经有了，如果让我们去实现他们，我们可能会实现的非常简单。

1. 首先打算用 HashMap 来存储键值对，作为内存缓存。
2. 实现那些获取值的方法。
3. 存储为 xml，在初始化 SharedPreference 的时候读取解析成 HashMap。
4. 感觉都不需要 单独有个 Editor，为什么不直接在 SharePreference 里定义写的方法呢？
5. 对于写的方法也不过是对 HashMap 的 put。
6. apply/commit 分别实现异步和同步的把 HashMap 保存为 xml。

是不是很简单？考虑到并发，我们需要把读和写的操作加锁。

好，下面就把我的想法和 SharedPreferencesImpl 实现比较一下，它的实现实在是太复杂了。我们要去探索它复杂背后的原由。

## SharedPreferencesImpl

[这是 SharedPreferencesImpl 的源码](https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/app/SharedPreferencesImpl.java)

SharedPreferencesImpl 所有代码都在上面一个文件中，只有一个队列的代码单独为一个文件，最后在讨论它。

我们上面考虑到的步骤，它都实现了，下面我们就一次来看看。

### 加载数据到内存

它的确使用了 Map 来缓存数据，从文件解析 xml 来加载数据，在构造函数里调用了 startLoadFromDisk() 来加载， 它里面 new 了一个新线程 调用了 loadFromDisk()。在它里面，的确做了解析 xml 成 map 的步骤。

### 访问操作

在获取 SharedPreferencesImpl 之前，也就是文章开头介绍的两个同步，对于特定名称的配置，实际上保证了单例。但是因为 loadFromDisk() 是在单独线程执行完成的，也就是说数据还没有读取完成，构造函数就返回了，也就可以调用 get 方法了，这肯定出问题，所以所有的访问操作，你会看到都是如下的样式：

``` Java
@Override
public boolean XXXX(String key) {
    synchronized (mLock) {
        awaitLoadedLocked();
        return mMap.XXXX(key);
    }
}
```
关键就在 awaitLoadedLocked()，它会判断如果还没有加载完成就会一直等待，并且如果加载过程中出现异常，这时候也会报错。

``` Java
while (!mLoaded) {
    try {
        mLock.wait();
    } catch (InterruptedException unused) {
    }
}
if (mThrowable != null) {
    throw new IllegalStateException(mThrowable);
}
```

着我们就知道，如果我们的配置文件如果太大，加载过程就会很长，如果我们的访问操作在UI线程就可能倒置界面卡顿，虽然只有一次。

### 为什么要有个专门的 Editor

我们先来把简单的打扫完成，EditImpl 内使用一个 HashMap 来存储修改了的键值对，所有的写操作除了 clear 使用了一个专门的属性来保存，其他操作都是作用在这个 HashMap 上。

而关键的逻辑在 commitToMemory() 里， commit 和 apply 都是调用了它。实现将加载的 map 和修改的 map 做差，然后将结果存到了专门的一个 内部类里 MemoryCommitResult。

``` Java
synchronized (mEditorLock) {
    boolean changesMade = false;
    if (mClear) {
        if (!mapToWriteToDisk.isEmpty()) {
            changesMade = true;
            mapToWriteToDisk.clear();
        }
        mClear = false;
    }
    for (Map.Entry<String, Object> e : mModified.entrySet()) {
        String k = e.getKey();
        Object v = e.getValue();
        // "this" is the magic value for a removal mutation. In addition,
        // setting a value to "null" for a given key is specified to be
        // equivalent to calling remove on that key.
        if (v == this || v == null) {
            if (!mapToWriteToDisk.containsKey(k)) {
                continue;
            }
            mapToWriteToDisk.remove(k);
        } else {
            if (mapToWriteToDisk.containsKey(k)) {
                Object existingValue = mapToWriteToDisk.get(k);
                if (existingValue != null && existingValue.equals(v)) {
                    continue;
                }
            }
            mapToWriteToDisk.put(k, v);
        }
        changesMade = true;
        if (hasListeners) {
            keysModified.add(k);
        }
    }
    mModified.clear();
    if (changesMade) {
        mCurrentMemoryStateGeneration++;
    }
    memoryStateGeneration = mCurrentMemoryStateGeneration;
}
```
先看 mClear 标志，如果清空，直接把 mapToWriteToDiskWriteToDisk 清空，mapToWriteToDiskWriteToDisk 是谁，就是 mMap，当前的配置键值对。接下来遍历 mModified，这个遍历完全放在判断 mClear 的 else 里嘛！不过考虑到监听值得变化，还是不能放到 else 里的，对于提交修改的key，在 clear 的时候还是会收到修改的回调，但是如果只是 clear 了，不会收到修改的回调。这部分逻辑在 notifyListeners(final MemoryCommitResult mcr)：

``` Java
if (Looper.myLooper() == Looper.getMainLooper()) {
  for (int i = mcr.keysModified.size() - 1; i >= 0; i--) {
      final String key = mcr.keysModified.get(i);
      for (OnSharedPreferenceChangeListener listener : mcr.listeners) {
          if (listener != null) {
              listener.onSharedPreferenceChanged(SharedPreferencesImpl.this, key);
          }
      }
  }
} else {
  // Run this function on the main thread.
  ActivityThread.sMainThreadHandler.post(() -> notifyListeners(mcr));
}
```
这里还保证了回调一定在 UI 线程，这写法很棒，判断如果不是在主线成，就在主线程再调一遍自己。尤其是使用了 lambda，更加有没。

### apply() 和 commit() 实现区别

commit() 里：
``` Java
MemoryCommitResult mcr = commitToMemory();
SharedPreferencesImpl.this.enqueueDiskWrite(
    mcr, null /* sync write on this thread okay */);
try {
    mcr.writtenToDiskLatch.await();
} catch (InterruptedException e) {
    return false;
} finally {
    if (DEBUG) {
        Log.d(TAG, mFile.getName() + ":" + mcr.memoryStateGeneration
                + " committed after " + (System.currentTimeMillis() - startTime)
                + " ms");
    }
}
notifyListeners(mcr);
return mcr.writeToDiskResult;
```

在提交内存后，也就是将修改事假到当前键值对map后，生成了一个 MemoryCommitResult 对象，在传给 enqueueDiskWrite() 后，会被传给 Runnable 里执行的 writeToFile(), 紧接着把 Runnable 入队列。

接下来，入队列后，调用 mcr.writtenToDiskLatch.await()，实现同步，这就是为什么说 commit 是同步的。writtenToDiskLatch 是一个 CountDownLatch，会在 mcr 的 setDiskWriteResult 被调用后，通知阻塞的线程运行，而 setDiskWriteResult 在上面的 writeToFile() 方法内，将改变后的配置写入完成后调用。

上面是 commit 如何实现同步保存的，下面再看看 apply 如何实现异步的：

``` Java
final MemoryCommitResult mcr = commitToMemory();
final Runnable awaitCommit = new Runnable() {
        @Override
        public void run() {
            try {
                mcr.writtenToDiskLatch.await();
            } catch (InterruptedException ignored) {
            }
            if (DEBUG && mcr.wasWritten) {
                Log.d(TAG, mFile.getName() + ":" + mcr.memoryStateGeneration
                        + " applied after " + (System.currentTimeMillis() - startTime)
                        + " ms");
            }
        }
    };
QueuedWork.addFinisher(awaitCommit);
Runnable postWriteRunnable = new Runnable() {
        @Override
        public void run() {
            awaitCommit.run();
            QueuedWork.removeFinisher(awaitCommit);
        }
    };
SharedPreferencesImpl.this.enqueueDiskWrite(mcr, postWriteRunnable);

```

它同样的先提交改动到内存，返回一个 MemoryCommitResult 的对象，然后在 Runnable 里等待写入文件完成，把这个 Runnable 加入了 QueuedWork。接下来，又在一个 postWriteRunnable 里执行之前那个 awaitCommit， 并从QueuedWork移除刚才设置的它， 为什么呢？

Android为了让在一个页面设置的配置在其他界面生效采取了一个机制，就是要保证在当前界面不可见时一定要保证配置保存完毕。所以在 ActivityThread 里的处理服务停止和 Activity 停止的地方调用了 QueuedWork 的 waitToFinish, 它里面就会遍历，所有的通过  addFinisher 添加的 Runnable。 而在每个写入操作完成后，当然可以移除了。


---
> 官方源码：
> https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/app/SharedPreferencesImpl.java
> https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/app/QueuedWork.java
> https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/app/ActivityThread.java
> 墙裂推荐这篇文章，太好了，我得好好学习了
> [请不要滥用SharedPreference](http://weishu.me/2016/10/13/sharedpreference-advices/)
