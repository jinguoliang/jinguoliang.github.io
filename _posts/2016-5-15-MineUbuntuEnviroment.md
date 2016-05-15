---
layout: post
title: Ubuntu16.04上Android环境搭建
category: 编程
tags: Ubuntu
---

#Android Studio  
- [下载Android Studio](http://www.android-studio.org/)
- 安装java sdk：使用apt安装openjdk-8-sdk，我安装java9失败，就安装了java8,也不行，然后把所有java相关的都删除了，然后安装8成功，9依然失败
- Android Sdk里有些工具是32位的所以需要安装对x32位的支持： 

  > sudo apt-get install -y libc6-i386 lib32stdc++6 lib32gcc1 lib32ncurses5 lib32z1

- adb 竟然支持我的两个设备，之前是需要配置的！！ 

#Vim 
- sudo apt install vim
- 安装vim 插件管理器：[pathogen](https://github.com/tpope/vim-pathogen) [Vundle](https://github.com/VundleVim/Vundle.vim)
- 安装vim 对 markdown的支持,因为写博客要用到[markdown](https://github.com/plasticboy/vim-markdown)

#jekyll 
- jekyll 是一个静态网站生成器，生成的静态网站可以放在github上
- jekyll 是使用ruby写的，所以先安装新版本的ruby，然后用gem安装jekyll

#zsh
- 据说zsh很强大，但是太复杂，这倒是可以理解的，但是的确因此让它不能流行
- 于是[oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh/)出现，它让zsh不难么复杂，于是我们就用zsh来替代我们使用的bash
- 如果你想让你的用户shell默认就是zsh：

    > 打开/etc/passwd
    > 将你的用户最后的bash改成zsh



