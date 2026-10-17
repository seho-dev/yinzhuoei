---
title: "Common Java Reflection Techniques"
description: "Java reflection lets you inspect a class's fields and methods and invoke an object's methods at runtime. Four ways to obtain a Class object, with getClass and .class recommended. Using Field to retrieve member fields: obtain the Class, instantiate through a no-argument constructor, and access the field…"
date: 2018-08-22
lang: en
translationKey: "2018-08-22_37_JAVA反射的常用方法"
categories:
  - "Backend"
  - "Life"
views: 5294
draft: false
---

Java reflection lets you inspect a class's fields and methods and invoke an object's methods at runtime.

**Four Ways to Obtain a Class Object**

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

The getClass and .class approaches are recommended.

**The Field Class: Retrieving Member Fields**

Retrieve a single field:

```java
Class cl = test.class;
Object obj = cl.newInstance();
Field name = cl.getDeclaredField("name");
name.setAccessible(true);  // 破坏封装
System.out.println(name.get(obj));
```

The process: obtain the Class → create an object through the no-argument constructor using newInstance() → retrieve the specified field → bypass access restrictions → use the Field object to read the field's value.

Retrieve all fields:

```java
Class cl = test.class;
Object obj = cl.newInstance();
Field fields[] = cl.getDeclaredFields();
for (Field field : fields) {
    System.out.println(field.getName());
}
```

**The Method Class: Retrieving Methods**

Retrieve all methods:

```java
Class cl = test.class;
Method me[] = cl.getDeclaredMethods();
for (Method method : me) {
    System.out.println(method.getName());
}
```

Retrieve a single method with no parameters:

```java
Class cl = test.class;
Object obj = cl.newInstance();
Method me = cl.getDeclaredMethod("ccc", new Class[]{});
Object re = me.invoke(obj, new Object[]{});
```

Retrieve a single method with parameters:

```java
Class cl = test.class;
Object obj = cl.newInstance();
Method me = cl.getDeclaredMethod("ccc", new Class[]{String.class, int.class});
Object re = me.invoke(obj, new Object[]{"谢振坤", 88});
```

**The Constructor Class: Retrieving Constructors**

Retrieve all constructors:

```java
Class cl = test.class;
Object obj = cl.newInstance();
Constructor gz[] = cl.getConstructors();
for (Constructor constructor : gz) {
    System.out.println(constructor);
}
```

Retrieve a single no-argument constructor:

```java
Class cl = test.class;
Constructor gz = cl.getConstructor();
test t = (test) gz.newInstance();
```

Retrieve a single constructor with parameters:

```java
Class cl = test.class;
Constructor gz = cl.getConstructor(String.class, int.class);
test t = (test) gz.newInstance("张三", 67);
```

**Array Reflection**

```java
Class cl = Class.forName("java.lang.Object");
Object arr = Array.newInstance(cl, 5);
Array.set(arr, 3, 5);  // 设置第3个值为5
Object elem = Array.get(arr, 3);  // 获取第3个值
System.out.println(elem);
```

![Download.jpg](https://www.yinzhuoei.com/usr/uploads/2018/08/1626642400.jpg)
