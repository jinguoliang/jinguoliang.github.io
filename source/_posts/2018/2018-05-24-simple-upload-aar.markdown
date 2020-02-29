---
layout: "post"
title: "这恐怕是史上最简单的上传 AAR 教程"
date: "2018-05-24 10:19"
---

在做项目的时候，抽出来一些工具方法，然后做其他项目的时候需要使用，只是后就有将这些工具方法抽出来单独形成一个库的需求了。在 Android Studio 里就是 AAR。
因为我是个人开发，想到方便的方法就是把 AAR 上传到本地 maven 库，用到的项目只需要添加对它的依赖就可以了。

## 上传配置

##### 1. 首先在要上传的模块的 build.gradle 里最外层添加如下代码，并做相应的配置

``` Gradle

apply plugin: 'maven' // 引入maven插件

group = 'your group' // 会按照group生成.m2下的目录路径
version = 'your release' // 指定版本

def localMavenRepo = 'file://' + new File(System.getProperty('user.home'), '.m2/repository').absolutePath

uploadArchives {
    repositories {
        mavenDeployer {
            repository(url: localMavenRepo)
        }
    }
}
```
你需要自己配置模块的版本，组。
需要说明的是，要上传的目标仓库需要明确指明，如上面的 localMavenRepo，而依赖仓库则只需要 mavenLocal()

##### 2. 同步一下你的配置
##### 3. 在 Android Studio 的 Gradle 面板里执行 uploadArchives task
##### 4. 在需要你的库的地方， 添加一个仓库 mavenLocal(), 添加依赖
``` gradle
implementation 'your group: projectName:your release'
```

#### 问题
默认上传的是 release 版本，debug 开关是关着的，需要手动设置为 debug 版本
