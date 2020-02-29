---
layout: "post"
title: "<翻译>如何写一个超级棒的编程技术博客"
date: "2018/05/25 08:27"
---

> 想要提高编程技术写作水平，在搜索时看到一篇英语文章感觉挺好的，虽然是14年的，但正如文中所说，它是那种有长期价值的文章，所以翻译过来分享给大家。
> 文中一些人名，文章标题没有翻译。


我希望你去写作，而不仅仅是写代码。

如果你是开源社区的一员，你可以通过写关于编程的文章来帮助我们，这种帮助跟编程提供的帮助是一样重要的。同时写作也对你有帮助，你可以为人所知，传播自己的想法。

更重要的，写作就是思考。没有哪种方式能比通过写作来解释一个东西更能让你对它深入理解了。

## Why?

你的专业知识有多狭窄不要紧。如果你比任何人都更好的解析纽约地铁的日程，我希望你能写出它来。如果你会教你的猫去照顾电子鸡，我绝对想让你写写你是怎么做到的。无论你精于什么，写出你所知道的。当我有一个问题是你所精通的时，我知道向你寻求帮助。

比如，[HappyBase](https://pypi.python.org/pypi/happybase/) 的作者，一个 HBase 的 Python 驱动者，在他开始他的项目时给我发邮件询问我的建议。他从我的博客得知我做了两个 MongoDB 的驱动，他的关于连接池的问题我应该是遇到过得。跟他工作是很刺激的，而且对于我希望贡献一个流行的项目的愿望也的到了满足。

在你的社区里被人熟知或者是个令人信服的解释者对你很会很有帮助。你的补丁更可能被项目接受，讲话也容易被会议接受，容易得到更多用户，容易得到工作。

对一个 bug 进行解释要求你彻底思考这个问题，这种方式比其他任何技术都好。我如此相信 “写作即思考”
 以至于当我看见一个难解的 bug 时，我的第一步是去写一篇文章。我去年在 PyMongo 项目遇到一个连接池问题的时候就是这样办的。所以有了这篇文章 [assigning to a threadlocal is not thread-safe](https://emptysqua.re/blog/another-thing-about-pythons-threadlocals/)。亲爱的读者我并没有那么聪明能够发现如此一个错综复杂的条件竞争，只是因为我通过写作来解释这个问题的时候，能对每一步深刻思考。

 ## What?

 我大致注意到五种程序员写的最好的文章： 讲个故事，说明一种观点，如何去做一件事或者使用一样东西，一个东西是如何工作的，还有就是评论一个东西。如果你想写，但是不知道选择什么主题，或者不知道如何写它，下面的内容能解决你的问题。

### Story

“我将要给你讲一个关于什么的故事，它教会了我怎么一个道理，导致了一个什么样的结果。首先发生了一件什么事情，然后又发生了一件什么事情。这就是关于那个什么的故事”

一些思路：

1. [We had an outage, this is the post-mortem.](https://groups.google.com/forum/#!topic/mongodb-user/UoqU8ofp134)
2. [I went to a conference, heard talks, met people, learned something.](https://emptysqua.re/blog/recap-open-source-bridge/)
3. [I survived a tough mudder and so did my FitBit.](http://meghangill.com/2013/06/05/how-i-survived-a-tough-mudder-with-my-fitbit-intact/)
4. [I had dwarf hamsters. They died. I grieved, then accepted.](https://emptysqua.re/blog/good-night-sweet-hamster/)

我们天生就对人们的故事有兴趣。你不必为此自责或厌烦。如果我通过你的博客对你有所了解，你的技术文章会更加温暖，我会对你印象深刻。

### Opinion

“论点。对不同意见的回应。对论点的重申。”　就像我在高中学到的一样。最重要的是，不是简单的说明一个观点，而是能提出引人注目的论据，带有趣味的去支持你的论点。

思路：

１. 一个什么东西将会成为下一个伟大的东西（锤子的ＴＮＴ将会成为下一代个人电脑）
２. 一个什么东西比另一个什么东西更好
３. [Open source authors have a grave responsibility to their users.](http://alexgaynor.net/2014/may/19/service/)
4. [It's okay not to contribute to open source.](http://jvns.ca/blog/2014/04/26/i-dont-feel-guilty-about-not-contributing-to-open-source/)
5. [College students do career fairs wrong.](https://emptysqua.re/blog/so-youre-coming-to-a-career-fair/)

### How-To

“在某种特定条件下做某件事是重要的。我将会想你展示如何做这种事。先这样做，然后做那个。好了，我想你展示了如何做这件事。你应该自己动手去做做了。”

思路：

1. 如何解决调试 crash 问题，没存泄露问题，条件竞争问题？
2. [How do you cultivate an open source project?](http://www.kennethreitz.org/essays/growing-open-source-seeds)
3. [How do you prepare a talk?](http://speaking.io/plan/repetition/)
4. [How do you run a conference?](http://meghangill.com/2012/03/11/how-to-run-a-tech-conference-part-1-getting-started/)
5. 只要你解决了一个问题，你就可以写一篇文章来介绍你是怎样做的

### How Something Works

“你想知道某个东西是如何工作的吗？我将会展示给你看它是怎么实现的。它做了这个，做了那个。现在我向你展示了它是如何工作的。”

对于几乎所有我觉得难的技术，在我读了它的源码以后，都会感觉更容易理解。为了能够对某个事物深入浅出，写作吧。

一个 “how something works” 的文章不需要动机。真的，一些读者为了更好的使用它，就会想去看看它是如何工作的。有很多想我这样的人，想知道所有东西是如何工作的，我们是这种文章的读者。 那些不想知道的人可以不去看。

思路：

1. Django ORM 是如何生成 SQL 的？
2. socket.settimeout() 是如何工作的？
3. [Why does this Python code raise a SyntaxWarning?](http://akaptur.github.io/blog/2014/06/11/of-syntax-warnings-and-symbol-tables/)
4. [How does xrange work?](http://late.am/post/2012/06/18/what-the-heck-is-an-xrange)

### Reviews

“我读了，或者看了，或者玩了，或者使用了某个东西。它是这么个样子的。我的体验是这样的。这个东西有这样的缺点，有那样的优点。总之，在某种情况下它是最好的。”

我们可能都喜欢去评价一本书，电影，游戏或者项目的好坏，但是这样没什么用。更多的是去描述和分析而不是评论好坏。告诉我这个东西为什么好。

思路：

1. 技术书籍！不必是最近出版的，但在你的领域内。以评价的心态去读一本书能够让你读的更仔细，你也能从中学习到好的写作技术。[这是我对 O'Reilly 的 "Building Node Applications with MongoDB and Backbone" 的评价](https://emptysqua.re/blog/building-node-applications-mongodb-backbone/)
2. 其他软件项目。但是言辞要得体。
3. 游戏，电影，音乐，非编程类的书籍：写评论是最好的练习，并且能够让你的博客吸粉。

## 你如何寻找读者

请不要关心有没有人来看。这不是写编程博客的目的。Seth Godin 说：“大部分时候，你致力于取悦大众，却总是失败。----”

既然不关心有没有人来看，就不要浪费时间做 SEO。你的目标不是去获得很多点击。你不是 BuzzFeed(媒体公司)。随机访问者对你没有价值，因为你不是展示广告。你的目标是吸引你领域的专业人士以便于你们可以分享观点。幸运的是，你不需要花多少力气就能让这些专业人士看到你的博客。

首先，找到你们社区阅读的聚合器。我写了很多关于 Python 的，Planet Python聚合器是我至今最好的分发文章的渠道。我只要把文章放进 Python 类别，它就会被纳入 feed, 这给我带来几百个访问者。如果把你的文章加入 Planet Python, 参考[这个文章](https://github.com/python/planet)。如果你写关于其他语言或技术的博客，找到它的聚合器，请求把你的文章纳入其中。

在 Tweeter 上发文章有一定价值。更有价值的是在 Reddit 上相关的子模块发文章。在你的主页上放上你最好的文章，而不是最近发布的文章。关于这点可以看[这个文章](https://training.kalzumeus.com/newsletters/archive/content-marketing-strategy)。

你可以在 Hacker News 试试运气，不过前面已经说过，没人会很严肃的去哪，我也不会。

## 你如何进一步提高

写！！！模仿最好的博客撰写者和最好的文章。

不要模仿 Daring Fireball， GigaOM 或者 TechCrunch。这些都是工业新闻网站，最终只会关心一个问题： 那个公司股票涨了那个公司股票降了? 这不是你的专业只是。这很无聊。要去模仿下面这样的：

Glyph Lefkowitz 在 [Unyilding](https://glyph.twistedmatrix.com/2014/02/unyielding.html) 中讨论了异步的最大作用不是效率，而是让竞争条件更容易避免。

Kristina Chodorow 在 [Stock Option Basics](http://www.kchodorow.com/blog/2013/04/09/stock-option-basics/)里讲了一个他个人的退出创业公司的故事，比其他作者都更好的描述了股票期权是如何工作的。在[Why Command Helper Suck](http://www.kchodorow.com/blog/2011/01/25/why-command-helpers-suck/)她公开严词批评了一些 MongoDB 设计，因为它们让用户无法理解。她的在 MongoleDB单元测试 的文章是非常专业的，我已经提过很多次它填补了 MongoDB 开发文档的可怕的空白。Kristina 有趣而亲和的语调在她的博客和 O'Reilly 出版的《MongoDB： The Definitive Guide》都有充分的体现。

Armin Ronacher 的文章　[Exec in Python](http://lucumr.pocoo.org/2011/2/1/exec-in-python/) 挺长的，难以执行的全面。看完它需要一个多小时。他花了几天去写它。我确信他在发表后还一直在完善。这篇文章对　Python2 和 Python3 发表了深刻的见解，讲解了 web2py 如何工作的，而且提出了他构造的替代的运行机制。

Julia Evans 在她的博客里表现的很随意，有激情，她说话也如此。但是别上当，她的这两篇([Should my conference do anonymous review?](https://jvns.ca/blog/2014/06/06/should-my-conference-do-anonymous-review/) and [Machine learning isn't Kaggle competitions](https://jvns.ca/blog/2014/06/19/machine-learning-isnt-kaggle-competitions/))文章都表现出她很细心。

Graham Dumpleton 的 [magisterial series on Python decorators ](https://github.com/GrahamDumpleton/wrapt/tree/master/blog) 在这话题上淘汰了其它所有的文章。

在 Open Source Bridge 上，你可以找到更多模仿的对象，学到更多提高编程写作的技巧。

## 如何挤出时间来写作

写作不必定期，不用说每天一篇，或者每周几篇。你最大的价值在于那些偶尔写出的深入的文章。另外也不用现在就要去写篇文章，因为最好的主题就在平时。[Patrick McKenzie](https://training.kalzumeus.com/newsletters/archive/content-marketing-strategy) 所：“你可以并且应该制定一个策略，主要去写有长期价值的东西。写那些能够有持续价值的文章和那些短命的文章花的时间几乎是一样的。”

所以慢慢来，当你有好的注意或者不一般的经验时，你将会被催促这去写就它。

## 总结

你有关于编程的非常特别又值得写的的事情，或者你有一种新的方式解释一个常见的话题。无论哪一个，我希望你写出来。解释的过程将会让你深刻理解，没有什么其他事能达到这个效果。如果你不知道写什么，看看我的建议，或者从一些好的博客找灵感。创造有长期价值的文章。