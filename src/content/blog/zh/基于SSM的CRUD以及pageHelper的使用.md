---
title: "基于SSM的CRUD以及pageHelper的使用"
description: "学了段时间 SSM，终于把增删改查做出来了。这篇会尽量讲详细一些，包括踩过的坑。跟着走能快速搭建 SSM 框架完成业务需求。 项目没用 Maven，XML 都是手动创建的。 1. 准备 jar 包 需要 SSM 包、JSTL、分页插件 PageHelper、S…"
date: 2018-11-05
lang: zh
translationKey: "2018-11-05_64_基于SSM的CRUD以及pageHelper的使用"
categories:
  - "后端"
views: 6098
draft: false
---

学了段时间 SSM，终于把增删改查做出来了。这篇会尽量讲详细一些，包括踩过的坑。跟着走能快速搭建 SSM 框架完成业务需求。

项目没用 Maven，XML 都是手动创建的。

**1. 准备 jar 包**

需要 SSM 包、JSTL、分页插件 PageHelper、SQL 解释 jar。

![QQ截图20181105182645.png](https://www.yinzhuoei.com/usr/uploads/2018/11/186309240.png)

完整 jar 包在文章末尾的 GitHub 下载。

**2. 项目目录结构**

![QQ截图20181105182808.png](https://www.yinzhuoei.com/usr/uploads/2018/11/3002441985.png)

- action：SpringMVC 控制层
- mapping：MyBatis 映射接口和文件
- pojo：业务实体类
- service：业务实现类

**3. 主要配置文件**

spring：

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

springmvc：

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

mybatis：

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

db.properties：

```properties
jdbc.driver=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/sys?characterEncoding=utf-8
jdbc.username=root
jdbc.password=swq891012
```

**4. MyBatis 映射**

接口：

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

映射 XML：

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

注意：id 要与接口方法名对应，namespace 唯一。

**5. DAO 层**

使用 PageHelper 后，查询返回的是 PageInfo：

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

PageInfo 包含分页信息：总页数、当前页、每页数量等。

**6. Service 层**

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

**7. Action 层**

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

源码：https://github.com/1018715564/ssm-CRUD
