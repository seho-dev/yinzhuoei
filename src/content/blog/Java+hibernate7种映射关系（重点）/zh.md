---
title: "Java+hibernate7种映射关系（重点）"
description: "ORM 是什么 ORM 全称 Object Relational Mapping，即对象关系映射。核心思想是把数据库表的数据映射成对象，这样就能用面向对象的方式操作数据库。Hibernate 正是实现了这种思想。 Hibernate 用到的文件 - 映射类 j…"
date: 2018-09-15
lang: zh
translationKey: "2018-09-15_40_Java+hibernate7种映射关系（重点）"
categories:
  - "后端"
views: 6033
draft: false
---

![u=1194465232,98399045&fm=26&gp=0.jpg](https://www.yinzhuoei.com/usr/uploads/2018/09/437225437.jpg)

**ORM 是什么**

ORM 全称 Object Relational Mapping，即对象关系映射。核心思想是把数据库表的数据映射成对象，这样就能用面向对象的方式操作数据库。Hibernate 正是实现了这种思想。

**Hibernate 用到的文件**

- **映射类 javabean**：把表字段描述成属性，把数据库数据映射成对象
- **映射文件 hbm**：描述表中所有属性和 javabean 的关系，是映射成对象的必要条件
- **数据库配置文件 cfg**：配置数据库信息、连接参数等

**七种映射关系**

**1. 一对一单向关联**

两种实现策略：主键和外键。

- **主键**：让两个表有相同的主键，数据库不额外维护关系
- **外键**：其实是多对一的特殊情况，也可以用来表示一对一

**2. 多对一单向**

在多的一方加入一方的外键，由多方维护关系。

```xml
<many-to-one name="group" column="groupid"/>
```

**3. 一对多单向**

与多对一方向相反，在一方加入多方的外键。要定义 set 集合：

```xml
<set name="students">
    <key column="classesid"/>
    <one-to-many class="com.hibernate.Student"/>
</set>
```

注意：多的一端不知道一端的存在，保存时关系字段可能是 null。常用解决办法是改用双向关联映射。

**4. 多对多单向**

需要额外一张表来维护关系：

```xml
<set name="roles" table="t_user_role">
    <key column="user_id"/>
    <many-to-many class="com.hibernate.Role" column="role_id"/>
</set>
```

**5. 双向一对一**

加个 `<one-to-one>` 标签即可，只影响加载速度。

```xml
<!-- 主键配置 -->
<one-to-one name="person"/>

<!-- 外键配置 -->
<one-to-one name="person" property-ref="idCard"/>
```

`property-ref` 是本类的主键，充当 person 类的外键来保持关联。

**6. 双向一对多**

为了解决单向一对多的缺陷而设计。在一方配置 set，多的一方配置 many-to-one：

```xml
<!-- 一方 -->
<set name="students" inverse="true">
    <key column="classesid"/>
    <one-to-many class="com.hibernate.Student"/>
</set>

<!-- 多方 -->
<many-to-one name="classes" column="classesid"/>
```

`inverse` 控制关系维护权。设为 true 说明本端不能维护关系，通常在多的一方维护关系，所以一般打开 inverse。

**7. 双向多对多**

双方都要维护关系，中间表名和字段必须一致：

```xml
<!-- 甲方 -->
<set name="users" table="t_user_role">
    <key column="role_id"/>
    <many-to-many class="com.hibernate.User" column="user_id"/>
</set>

<!-- 乙方 -->
<set name="roles" table="t_user_role">
    <key column="user_id"/>
    <many-to-many class="com.hibernate.Role" column="role_id"/>
</set>
```

**总结**

双向一对多的映射用得最频繁。要彻底领悟这几种映射关系，需要多敲代码。

---
