---
layout: post
title: "CentOS 上 无 Root 安装 Python"
category: 实践
tags: Python 服务器 Root RPM CPIO
---

## 背景

工作需要，需要做个爬虫放到服务器上定期怕数据，从本地写好，在发布到服务器的时候，遇到难题了。服务器系统太老了，Python版本2.6，没有 pip，而且还没有  Root 权限，情形可谓十分尴尬。

## 问题

我需要一个 Python 环境，并且安装了 Scrapy，怎么办？

## 尝试

### 尝试使用 easy_install 通过修改安装路径解决

{% highlight shell %}
% easy_install --prefix=/home/work/tmppython pip # pip 不能在 --prefix 前面谈疼
{% endhighlight%}

要设置 PYTHONPATH=/home/work/tmppython

这个方法很正，可以安装上 pip，然后修改 pip 的安装路径不就可以安装 scrapy 了嘛，无奈安装失败，可能兼容性问题。

{% highlight shell %}
% pip install --install-option="--prefix=/home/work/tmppython" scrapy
{% endhighlight%}

easy_install 安装 scrapy，同样失败，问题还是一样的，找不到某个模块。估计是 Python2.6 的问题。

### 我要重新安装 Python3.4

#### 1. 下载源码包

下载了源码包，我就 configure -> make -> make install，结果当然以失败告终，因为它还依赖其他东西。

#### 2. 装依赖

我能不能直接把 RPM 安装到我指定的目录呢？经查看命令帮助，发现可以，既可以设置下载 RPM 的路径，也可以设置安装路径，但是，为什么 yum 一定要让我以 root 账户运行呢？悲剧！

后来，从网上找到一种方法，使用 yumdownloader 命令下载需要的 rpm，然后使用 rpm2cpio 将 rpm 转成 cpio 然后 用 cpio 命令将 cpio 数据解压出来。

最终，就是以这种方式解决了。下面是过程：

{% highlight shell linenos %}
% yumdownloader --resolve zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tk-devel gcc make # 这回下载所有的这些 rpm 并且还有他们依赖的 rpm
% decompressRPM.sh # 这是我写的脚本，是一条一条的对每一个文件 rpm 都执行命令： rpm2cpio FILE.rpm |cpio -idv
% # 解压出 Python 源码，去到解压出的目录
% ./configure --prefix=/path/Python-3.4.1 --libdir=/rpm 解压出的目录/lib
% make
% maek install
{% endhighlight%}
以上是基本的过程，Python 的依赖时我在网上搜到的，解决了我这次问题，不一定能解决你的。现在才发现，服务器如果没有标准真的是很痛苦呀，配环境就搞死人了。

#### 3. 最终的推荐

在写这篇文章的时候，查找资料，无意发现了[这个网址](https://www.anaconda.com/download/),是一个数据科学平台，它的好处，就是完全打包了一整套的工具，包括 Python3.4，对就是我们想要的 Python3.4。很简单，回答几个问题就装上了。
