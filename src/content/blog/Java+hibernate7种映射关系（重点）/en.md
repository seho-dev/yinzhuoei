---
title: "Java and Hibernate: Seven Essential Relationship Mappings"
description: "ORM stands for Object Relational Mapping. Its core idea is to map data in database tables to objects, allowing you to work with a database in an object-oriented way. Hibernate implements this approach. This post covers its configuration files and seven relationship mappings…"
date: 2018-09-15
lang: en
translationKey: "2018-09-15_40_Java+hibernate7种映射关系（重点）"
categories:
  - "Backend"
views: 6033
draft: false
---

![u=1194465232,98399045&fm=26&gp=0.jpg](https://www.yinzhuoei.com/usr/uploads/2018/09/437225437.jpg)

**What Is ORM?**

ORM stands for Object Relational Mapping. Its core idea is to map data in database tables to objects, so you can work with the database in an object-oriented way. Hibernate implements this approach.

**Files Used by Hibernate**

- **Mapped JavaBean class**: Represents table columns as properties and maps database data to objects
- **HBM mapping file**: Describes the relationships between all the table's fields and the JavaBean; required for mapping the data to objects
- **CFG database configuration file**: Configures database details, connection parameters, and related settings

**Seven Relationship Mappings**

**1. Unidirectional One-to-One**

There are two implementation strategies: primary keys and foreign keys.

- **Primary key**: Give both tables the same primary key, without maintaining a separate relationship in the database
- **Foreign key**: Treat one-to-one as a special case of many-to-one

**2. Unidirectional Many-to-One**

Add a foreign key referencing the "one" side to the "many" side. The "many" side maintains the relationship.

```xml
<many-to-one name="group" column="groupid"/>
```

**3. Unidirectional One-to-Many**

This reverses the direction of many-to-one: the "one" side holds references to the "many" side. Define a set collection:

```xml
<set name="students">
    <key column="classesid"/>
    <one-to-many class="com.hibernate.Student"/>
</set>
```

Note: The "many" side does not know that the "one" side exists, so the relationship field may be null when saved. A common solution is to use a bidirectional association instead.

**4. Unidirectional Many-to-Many**

An additional table is needed to maintain the relationship:

```xml
<set name="roles" table="t_user_role">
    <key column="user_id"/>
    <many-to-many class="com.hibernate.Role" column="role_id"/>
</set>
```

**5. Bidirectional One-to-One**

Just add a `<one-to-one>` tag; this only affects loading performance.

```xml
<!-- Primary key configuration -->
<one-to-one name="person"/>

<!-- Foreign key configuration -->
<one-to-one name="person" property-ref="idCard"/>
```

`property-ref` is the primary key of this class, acting as a foreign key for the person class to maintain the association.

**6. Bidirectional One-to-Many**

This addresses the shortcomings of unidirectional one-to-many. Configure a set on the "one" side and many-to-one on the "many" side:

```xml
<!-- The "one" side -->
<set name="students" inverse="true">
    <key column="classesid"/>
    <one-to-many class="com.hibernate.Student"/>
</set>

<!-- The "many" side -->
<many-to-one name="classes" column="classesid"/>
```

`inverse` controls which side maintains the relationship. Setting it to true means this side cannot maintain it. Usually, the "many" side manages the association, so inverse is generally enabled on the "one" side.

**7. Bidirectional Many-to-Many**

Both sides need relationship mappings, and the join table name and columns must match:

```xml
<!-- Side A -->
<set name="users" table="t_user_role">
    <key column="role_id"/>
    <many-to-many class="com.hibernate.User" column="user_id"/>
</set>

<!-- Side B -->
<set name="roles" table="t_user_role">
    <key column="user_id"/>
    <many-to-many class="com.hibernate.Role" column="role_id"/>
</set>
```

**Summary**

Bidirectional one-to-many is the mapping used most often. To truly understand these relationships, you need to write plenty of code.

---
