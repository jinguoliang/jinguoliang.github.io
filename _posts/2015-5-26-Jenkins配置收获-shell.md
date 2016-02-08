---
layout: post
title: Jenkins配置总结
categories: 工具 
tags: Jenkins Android
---

##背景
###Bash
bash是类unix系统上的一个shell，即系统的壳，它包裹了系统，给用户提供了一个接口去与系统交互。为了做一些自动化工作，有了bash脚本，通过脚本，可以做一系列的与系统的交互
###Jenkins
为了让自动化更加方便，出现了Jenkins。它是一种持续集成工具。通过配置，仅需一键，或者少许配置，或者在特定的时间自动运行构建工程，当然不限于构建工程。  

##Jenkins配置过程
###1. 安装

1. 官方下载jenkins.war
2. 两种方式安装

>  * 直接运行命令：
java -jar jenkins.war
>  * 使用servlet容器，如tomcat

###注意
* 要装新版本，旧版本太恶心了，我用apt-get安装的，安装倒是方便，但是装插件差点没哭了。
* 我们当然要使用简单的命令了，java -jar jenkins.war 。
* log信息会输出到终端,但可以通过参数制定输出的文件
* 会在用户目录下建一个.jenkins作为它的home目录
* 开机启动是个问题，考虑到这个问题，不如随web 服务器启动来的方便  


###2. 配置
详细过程不想说了，网上有太多，只说说我觉的比较重要的吧。  

1. Jenkins支持插件，有些功能是需要插件支持的，如git配置
2. 我用的比较多的插件是多选框，默认的配置控件没有，需要安装Extended Choice Parameter plugin
3. 旧版本下载插件超恶心
4. 我们最好给jenkins创建个用户，使用这个用户运行jenkins，这样安全
5. 配置git时，可能会报host key verify failed。先切到jenkins用户，生成密钥，添加到git服务器，然后执行git clone 测试通过了再配置。
6. 缺少java装java，缺少ant装ant

##Bash脚本
人家jenkins提供了调用构建工具的步骤，但我一般都不用，都在脚本里做了。一般就是配置一下参数配置，再写个脚本根据参数执行构建就是了。

以下是一些功能点：
  
* 模式替换  
{% highlight bash %}
sed  "/.*UMENG_CHANNEL.*/ s/\(.*value=\"\)[^\"]\+\(\".*\)/\1$newChannel\2/ " $ManifestFile > $ManifestFile.bak  
{% endhighlight %}
这个语句的意思是在包含UMENG_CHANNEL的一行，将value=""里引号里的内容替换替换称$newChannel  
下面来详细说明一下：  
> 1. sed语句， 前一部分选出匹配的行，后一部分是对这一行的操作。这里，后一部分是一个替换命令，格式为s/old/new/
> 2. 正则表达式，  上面语句使用了组，即用（）标识一个组，使用\NUM来引用之前标识出的组  
> 3. 具体的sed用法还是自己搜吧，这里只是分解一下比较复杂的内容  


* 分割一个字符串并遍历 这个语句有点复杂，不知道有没有简单的。
{% highlight bash %}
while IFS=',' read -a ADDR; do  # IFS为分隔符, 把$ChannelIds值作为标准输入,用read读取,  
    for i in "${ADDR[@]}"; do
        #这里的$i就是$Channels通过，分割后的每一个channel
    done
done <<< "$Channels"
{% endhighlight %}
> 1.<<<  
这叫Here Strings，就是说她后面是一个字符串，不管是变量还是什么，都被作为标准输入  
还有个<<,叫Here Documents,这特性很棒，他的格式这样：
> > {% highlight bash %}
<<[-]word
    here-document
word
{% endhighlight %}
> > word是一个标识符，来表示here-document的开始和结束。  如果word被引号包着，则后面的here-doc不进行扩展，即变量不会替换成值
here-document会被作为标准输入，换行会被保留  
  
> 2.IFS=',' read -a arr  
read 从标准输入读数据存到arr这个变量里，-a标识读取的是数组，IFS这个环境变量标识读取的分隔符   
bash的数组简直就是个大坑！！！  
虽然之前看过一本Bash的书，但是还是不怎么领会精髓，感觉特别多的坑  

---
###官方定义：  
Jenkins做两个工作：  

1. 持续构建和测试软件项目
2. 监督外部执行的工作，如cron jobs或者procmail jobs。

[最佳实践](https://wiki.jenkins-ci.org/display/JENKINS/Jenkins+Best+Practices)
