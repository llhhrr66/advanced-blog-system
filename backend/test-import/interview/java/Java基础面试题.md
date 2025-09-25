---
title: Java基础面试题精选
date: 2025-09-20 10:00:00
updated: 2025-09-25 15:00:00
tags: [Java, 面试题, 基础]
categories: Java面试
original: https://example.com/java-interview
---

# Java基础面试题精选

## 1. ✅ 什么是Java的面向对象特性？

Java的面向对象特性主要包括：

### 封装（Encapsulation）
- 将数据和方法封装在类中
- 通过访问修饰符控制访问权限
- 提供getter/setter方法访问私有属性

```java
public class Person {
    private String name;
    private int age;
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
}
```

### 继承（Inheritance）
- 子类继承父类的属性和方法
- 实现代码复用
- Java只支持单继承

```java
public class Student extends Person {
    private String studentId;
    
    // 继承了Person的name和age属性
}
```

### 多态（Polymorphism）
- 同一接口的不同实现
- 方法重载和方法重写
- 运行时动态绑定

```java
Animal animal = new Dog();
animal.makeSound(); // 调用Dog的makeSound方法
```

### 抽象（Abstraction）
- 抽象类和接口
- 隐藏实现细节，只暴露必要的接口

## 2. ✅ String、StringBuilder和StringBuffer的区别？

| 特性 | String | StringBuilder | StringBuffer |
|------|--------|---------------|--------------|
| 可变性 | 不可变 | 可变 | 可变 |
| 线程安全 | 安全 | 不安全 | 安全 |
| 性能 | 较低 | 最高 | 中等 |
| 使用场景 | 字符串不变 | 单线程字符串操作 | 多线程字符串操作 |

### 示例代码：
```java
// String - 每次修改都创建新对象
String str = "Hello";
str = str + " World"; // 创建新的String对象

// StringBuilder - 单线程环境
StringBuilder sb = new StringBuilder("Hello");
sb.append(" World"); // 在原对象上修改

// StringBuffer - 多线程环境
StringBuffer sbf = new StringBuffer("Hello");
sbf.append(" World"); // 线程安全的修改
```

## 3. ❌ HashMap和HashTable的区别？

主要区别：
1. **线程安全性**：HashTable线程安全，HashMap非线程安全
2. **null值**：HashMap允许null键值，HashTable不允许
3. **性能**：HashMap性能更好
4. **继承关系**：HashTable继承Dictionary类，HashMap继承AbstractMap类

## 4. ⭐️ JVM内存结构是什么？

JVM内存主要分为以下几个区域：

### 堆（Heap）
- 存储对象实例
- 分为新生代和老年代
- 所有线程共享

### 方法区（Method Area）
- 存储类信息、常量、静态变量
- JDK8后改为元空间（Metaspace）

### 虚拟机栈（JVM Stack）
- 每个线程私有
- 存储局部变量、操作数栈、方法出口等

### 本地方法栈（Native Method Stack）
- 为Native方法服务

### 程序计数器（Program Counter）
- 记录当前线程执行的字节码行号

## 5. 什么是Java的垃圾回收机制？

垃圾回收（GC）是Java自动管理内存的机制：

### GC算法
- **标记-清除**：标记不可达对象，然后清除
- **复制算法**：将存活对象复制到另一块内存
- **标记-整理**：标记后移动存活对象，整理内存
- **分代收集**：根据对象年龄采用不同算法

### 垃圾收集器
- Serial GC
- Parallel GC
- CMS (Concurrent Mark Sweep)
- G1 GC
- ZGC (JDK11+)

#Java #面试 #基础知识
