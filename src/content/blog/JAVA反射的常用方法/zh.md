---
title: "JAVA反射的常用方法"
description: "Java 反射机制：运行状态中，可以知道任意类的所有属性和方法，可以调用任意对象的任意方法。 获取 Class 的四种方法 推荐用 getClass 和 .class 方法。 Field 类：获取成员属性 获取单个属性： 流程：先拿到 Class → 通过无参…"
date: 2018-08-22
lang: zh
translationKey: "2018-08-22_37_JAVA反射的常用方法"
categories:
  - "后端"
  - "唠嗑"
views: 5294
draft: false
---

Java 反射机制：运行状态中，可以知道任意类的所有属性和方法，可以调用任意对象的任意方法。

**获取 Class 的四种方法**

```java
// 1. 通过对象获取
test ts = new test();
Class cl = ts.getClass();

// 2. 通过类名获取
try {
    Class cl = Class.forName("com.entity.test");
} catch (ClassNotFoundException e) {
    e.printStackTrace();
}

// 3. 通过 .class 获取
Class cl = test.class;

// 4. 通过包装类获取
Class cl = Boolean.TYPE;
```

推荐用 getClass 和 .class 方法。

**Field 类：获取成员属性**

获取单个属性：

```java
Class cl = test.class;
Object obj = cl.newInstance();
Field name = cl.getDeclaredField("name");
name.setAccessible(true);  // 破坏封装
System.out.println(name.get(obj));
```

流程：先拿到 Class → 通过无参构造 newInstance() 获取对象 → 获取指定属性 → 破坏封装 → 通过 Field 对象拿到属性值。

获取全部属性：

```java
Class cl = test.class;
Object obj = cl.newInstance();
Field fields[] = cl.getDeclaredFields();
for (Field field : fields) {
    System.out.println(field.getName());
}
```

**Method 类：获取方法**

获取全部方法：

```java
Class cl = test.class;
Method me[] = cl.getDeclaredMethods();
for (Method method : me) {
    System.out.println(method.getName());
}
```

获取单个方法（不带参数）：

```java
Class cl = test.class;
Object obj = cl.newInstance();
Method me = cl.getDeclaredMethod("ccc", new Class[]{});
Object re = me.invoke(obj, new Object[]{});
```

获取单个方法（带参数）：

```java
Class cl = test.class;
Object obj = cl.newInstance();
Method me = cl.getDeclaredMethod("ccc", new Class[]{String.class, int.class});
Object re = me.invoke(obj, new Object[]{"谢振坤", 88});
```

**Constructor 类：获取构造方法**

获取全部构造方法：

```java
Class cl = test.class;
Object obj = cl.newInstance();
Constructor gz[] = cl.getConstructors();
for (Constructor constructor : gz) {
    System.out.println(constructor);
}
```

获取单个构造方法（无参）：

```java
Class cl = test.class;
Constructor gz = cl.getConstructor();
test t = (test) gz.newInstance();
```

获取单个构造方法（有参）：

```java
Class cl = test.class;
Constructor gz = cl.getConstructor(String.class, int.class);
test t = (test) gz.newInstance("张三", 67);
```

**反射数组**

```java
Class cl = Class.forName("java.lang.Object");
Object arr = Array.newInstance(cl, 5);
Array.set(arr, 3, 5);  // 设置第3个值为5
Object elem = Array.get(arr, 3);  // 获取第3个值
System.out.println(elem);
```

![下载.jpg](https://www.yinzhuoei.com/usr/uploads/2018/08/1626642400.jpg)
