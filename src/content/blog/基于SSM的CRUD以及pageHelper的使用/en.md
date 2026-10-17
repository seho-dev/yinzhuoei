---
title: "CRUD with SSM and Pagination with PageHelper"
description: "After spending some time learning SSM, I finally got CRUD working. This walkthrough covers the setup in detail, including the pitfalls I encountered, so you can quickly put together an SSM application. The project does not use Maven; all XML files were created by hand."
date: 2018-11-05
lang: en
translationKey: "2018-11-05_64_基于SSM的CRUD以及pageHelper的使用"
categories:
  - "Backend"
views: 6098
draft: false
---

After spending some time learning SSM, I finally got create, read, update, and delete operations working. I will go into as much detail as possible here, including the pitfalls I encountered. Follow along to quickly set up an SSM application that meets your business requirements.

This project does not use Maven. All XML files were created by hand.

**1. Prepare the JAR Files**

You will need the SSM libraries, JSTL, the PageHelper pagination plugin, and a SQL parser JAR.

![QQ screenshot 20181105182645.png](https://www.yinzhuoei.com/usr/uploads/2018/11/186309240.png)

You can download the complete set of JAR files from the GitHub repository linked at the end of this post.

**2. Project Directory Structure**

![QQ screenshot 20181105182808.png](https://www.yinzhuoei.com/usr/uploads/2018/11/3002441985.png)

- action: the Spring MVC controller layer
- mapping: MyBatis mapper interfaces and mapping files
- pojo: business entity classes
- service: business logic implementation classes

**3. Main Configuration Files**

spring:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns="http://www.springframework.org/schema/beans" xmlns:context="http://www.springframework.org/schema/context"
    xmlns:aop="http://www.springframework.org/schema/aop" xmlns:tx="http://www.springframework.org/schema/tx"
    xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-2.5.xsd http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop-2.5.xsd http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx-2.5.xsd">

    <context:property-placeholder location="classpath:db.properties"/>

    <bean id="dataSource" class="org.apache.commons.dbcp.BasicDataSource" destroy-method="close">
        <property name="driverClassName" value="${jdbc.driver}" />
        <property name="url" value="${jdbc.url}" />
        <property name="username" value="${jdbc.username}" />
        <property name="password" value="${jdbc.password}" />
        <property name="maxActive" value="10" />
        <property name="maxIdle" value="5" />
    </bean>

    <bean id="sqlSessionFactoryBean" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="dataSource"/>
        <property name="configLocation" value="classpath:mybaties.config.xml"/>
        <property name="mapperLocations" value="classpath:com/ssmall/mapping/*.xml"></property>
    </bean>

    <context:component-scan base-package="com">
        <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Controller" />
    </context:component-scan>

    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource"/>
    </bean>

    <tx:annotation-driven transaction-manager="transactionManager"/>
</beans>
```

springmvc:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:p="http://www.springframework.org/schema/p"
    xmlns:context="http://www.springframework.org/schema/context"
    xmlns:mvc="http://www.springframework.org/schema/mvc"
    xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-4.0.xsd
        http://www.springframework.org/schema/mvc http://www.springframework.org/schema/mvc/spring-mvc-4.0.xsd
        http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-4.0.xsd">

    <context:component-scan base-package="com" />
    <mvc:annotation-driven />
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/views/"></property>
        <property name="suffix" value=".jsp"></property>
    </bean>
    <bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
        <property name="defaultEncoding" value="UTF-8"></property>
        <property name="maxUploadSize" value="1024000"></property>
    </bean>
</beans>
```

mybatis:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <typeAliases>
        <typeAlias alias="User" type="com.ssmall.pojo.Userpojo" />
    </typeAliases>
    <plugins>
        <plugin interceptor="com.github.pagehelper.PageHelper">
            <property name="dialect" value="mysql" />
        </plugin>
    </plugins>
</configuration>
```

db.properties:

```properties
jdbc.driver=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/sys?characterEncoding=utf-8
jdbc.username=root
jdbc.password=swq891012
```

**4. MyBatis Mapping**

The interface:

```java
package com.ssmall.mapping;

import java.util.List;
import com.ssmall.pojo.Userpojo;

public interface UserMapping {
    public List<Userpojo> getAll();
    public Userpojo getUser(Integer id);
    public boolean deleteById(Integer id);
    public boolean add(Userpojo user);
    public boolean update(Userpojo user);
}
```

The mapper XML:

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.ssmall.mapping.UserMapping">
    <select id="getUser" parameterType="int" resultType="com.ssmall.pojo.Userpojo">
        select * from t_user where id=#{id}
    </select>
    <select id="getAll" resultType="com.ssmall.pojo.Userpojo">
        select * from t_user
    </select>
    <delete id="deleteById" parameterType="int">
        delete from t_user where id=#{id}
    </delete>
    <insert id="add">
        insert into t_user(username,password,account) values (#{username},#{password},#{account})
    </insert>
    <update id="update">
        update t_user set username=#{username},password=#{password},account=#{account} where id=#{id}
    </update>
</mapper>
```

Note: each `id` must match the corresponding interface method name, and the `namespace` must be unique.

**5. The DAO Layer**

With PageHelper, the query results are returned in a PageInfo object:

```java
@Repository
public class IPublicDaoImpl extends SqlSessionDaoSupport implements PublicDao {

    @Resource
    public void setSessionFactory(SqlSessionFactory sqlSessionFactory) {
        super.setSqlSessionFactory(sqlSessionFactory);
    }

    public Userpojo get(int id) {
        UserMapping mapper = this.getSqlSession().getMapper(UserMapping.class);
        return mapper.getUser(id);
    }

    public static final int PAGE_SHOW_NUMBER = 5;

    @Override
    public PageInfo<Userpojo> getAll(Integer index) {
        UserMapping mapper = this.getSqlSession().getMapper(UserMapping.class);
        PageHelper.startPage(index, PAGE_SHOW_NUMBER);
        List<Userpojo> all = mapper.getAll();
        PageInfo<Userpojo> pageInfo = new PageInfo<Userpojo>(all);
        return pageInfo;
    }

    @Override
    public boolean deleteById(Integer id) {
        UserMapping mapper = this.getSqlSession().getMapper(UserMapping.class);
        return mapper.deleteById(id);
    }

    @Override
    public boolean addUser(Userpojo user) {
        UserMapping mapper = this.getSqlSession().getMapper(UserMapping.class);
        return mapper.add(user);
    }

    @Override
    public boolean updateUser(Userpojo user) {
        UserMapping mapper = this.getSqlSession().getMapper(UserMapping.class);
        return mapper.update(user);
    }
}
```

PageInfo contains pagination details such as the total number of pages, the current page, and the page size.

**6. The Service Layer**

```java
@Service
public class IUserServiceImpl implements UserService {

    @Resource
    private PublicDao dao;

    public Userpojo get(Integer id) {
        return this.dao.get(id);
    }

    public PageInfo<Userpojo> getAll(Integer pageNum) {
        return this.dao.getAll(pageNum);
    }

    public boolean deleteById(Integer id) {
        return this.dao.deleteById(id);
    }

    public boolean addUser(Userpojo user) {
        return this.dao.addUser(user);
    }

    public boolean updateUser(Userpojo user) {
        return this.dao.updateUser(user);
    }
}
```

**7. The Action Layer**

```java
@Controller
public class UserAction {
    @Resource
    private UserService userService;

    @RequestMapping("/user/all/{index}")
    public ModelAndView getUserAll(@PathVariable("index") Integer index) {
        ModelAndView model = new ModelAndView("list");
        PageInfo<Userpojo> all = userService.getAll(index);
        List<Userpojo> list = all.getList();
        model.addObject("allList", list);
        model.addObject("index", index);
        model.addObject("lastnum", all.getPages());
        return model;
    }

    @RequestMapping("/deleteById")
    public String DeleteById(@RequestParam("id") Integer id) {
        userService.deleteById(id);
        return "redirect:/user/all/1";
    }

    @RequestMapping("/user/addUser")
    public String addUser(Userpojo user) {
        userService.addUser(user);
        return "redirect:/user/all";
    }

    @RequestMapping("/user/addready")
    public String addReady(Model model) {
        model.addAttribute("itemForm", "form");
        return "form";
    }

    @RequestMapping("/update")
    public String update(Userpojo user) {
        userService.updateUser(user);
        return "redirect:/user/all/1";
    }

    @RequestMapping("/updateById")
    public String updateReady(@RequestParam("id") Integer index, Model model) {
        Userpojo userpojo = userService.get(index);
        model.addAttribute("userlist", userpojo);
        return "form";
    }
}
```

---

Source code: https://github.com/1018715564/ssm-CRUD
