---
layout: post
title: <翻译> Java VS Kotlin
categories:
- 编程
- 翻译
tags:
- 语言
- Java
- Kotlin
- 翻译
---

要想了解一个新事物，将它与所熟悉的就实物做对比是最好不过的方式了，下文为 Kotlin 官方网站的一篇文章，对 Java 和 Kotlin 做了对比。我根据自己的理解添加了一点解释。原文对每一条都有链接让你去深入了解，很好！！

### Java 有， Kotlin 没有的：

1. checked 异常（一个方法在声明抛出异常后，使用它的方法必须使用 try 捕获或者声明抛出）
2. 基本类型，它们不是类
3. 静态方法，属于类的方法
4. 非私有 Feild（Java 的类包含数据和方法，数据被称为 Feild，可以直接在外部访问非私有的Feild）
5. 泛型里的通配符（类似这种的 Collection<? extends E> 或者这样 List<? super String>）

### Kotlin 有， Java 没有的：

1. lambda表达式 和 内联函数（能够提高性能）
2. 扩展函数
3. Null 安全（变量区分可Null 和　可不Null）
4. 智能转换
5. String 模板（类似这样的 println("hello $Name"))
6. 属性（准确的说，Java里面的类的数据叫 Feild）
7. 基本构造器（类似这样的 class Persion(name: String) {} 这里的小括号是基本构造器）
8. 支持代理模式，不需要写多余的代码（类似这样的 class Proxy(impl: Base): Base by impl)
9. 变量和属性的类型推断 （val a = 5, 可以推断出 a 的类型是 Integer，并不是动态类型）
10. 支持单例模式 （类似这样的 object Global {}）
11. 类型参数（类似 Java 的反省）
12. 区间表达式 （类似这样的　1..5 == [1, 2, 3, 4, 5]）
13. 操作符重载 （可以重新定义 ＋　－　等等）
14. 伙伴对象 （Companion Object, 可以用来实现静态变量，静态方法）
15. 数据类 （类似这样 data class Persion(name: String) {} 就是在正常的类之前加了个 data Kotlin 会给太生成一些方法）
16. 区分了可变集合和不可变集合
17. 协程 （不是说走就走的那个携程）

---
[原文(Comparison to Java Programming Language)](http://kotlinlang.org/docs/reference/comparison-to-java.html)