---
title: "SpringSecurity安全框架和密码加密（笔记）"
description: "今天学了 SpringSecurity，记录一下知识点和踩过的坑。 SpringSecurity 是安全框架，主要用于登录，提供安全性和性能，减少开发工作。 入门配置 pattern 配置不拦截的资源，access 指定需要的角色。ROLE 前缀是必须的。框架…"
date: 2018-12-16
lang: zh
translationKey: "2018-12-16_74_SpringSecurity安全框架和密码加密（笔记）"
categories:
  - "后端"
views: 5381
draft: false
---

![timg (1).jpg](https://www.yinzhuoei.com/usr/uploads/2018/12/367711948.jpg)

今天学了 SpringSecurity，记录一下知识点和踩过的坑。

SpringSecurity 是安全框架，主要用于登录，提供安全性和性能，减少开发工作。

**入门配置**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans:beans xmlns="http://www.springframework.org/schema/security"
    xmlns:beans="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beanshttp://www.springframework.org/schema/beans/spring-beans.xsd
    http://www.springframework.org/schema/securityhttp://www.springframework.org/schema/security/spring-security.xsd">

    <!-- 不拦截的页面 -->
    <http pattern="/login.html" security="none"></http>
    <http pattern="/login_error.html" security="none"></http>

    <!-- 页面拦截规则 -->
    <http use-expressions="false">
        <intercept-url pattern="/**" access="ROLE_USER"/>
        <form-login default-target-url="/index.html" authentication-failure-url="/login_error.html"/>
        <csrf disabled="true"/>
    </http>

    <!-- 认证管理器 -->
    <authentication-manager>
        <authentication-provider>
            <user-service>
                <user name="admin" password="admin" authorities="ROLE_USER"/>
            </user-service>
        </authentication-provider>
    </authentication-manager>
</beans:beans>
```

`pattern` 配置不拦截的资源，`access` 指定需要的角色。`ROLE_` 前缀是必须的。框架会自动生成登录页面。

**自定义登录页面**

```xml
<!-- 不拦截的资源 -->
<http pattern="/*.html" security="none"></http>
<http pattern="/css/**" security="none"></http>
<http pattern="/img/**" security="none"></http>
<http pattern="/js/**" security="none"></http>
<http pattern="/plugins/**" security="none"></http>

<http use-expressions="false">
    <intercept-url pattern="/**" access="ROLE_ADMIN" />
    <form-login login-page="/login.html" default-target-url="/admin/index.html"
        authentication-failure-url="/login.html" always-use-default-target="true" />
    <csrf disabled="true" />
    <headers>
        <frame-options policy="SAMEORIGIN" />
    </headers>
    <logout/>
</http>
```

**前端表单要求**

- action：`/login`
- method：POST
- 用户名 name：`username`
- 密码 name：`password`

**数据库查询 + 密码加密**

实现 `UserDetailsService` 接口来查询数据库：

```java
public class UserDetailsServiceImpl implements UserDetailsService {

    private SellerService sellerService;

    public void setSellerService(SellerService sellerService) {
        this.sellerService = sellerService;
    }

    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        List<GrantedAuthority> authorities = new ArrayList();
        authorities.add(new SimpleGrantedAuthority("ROLE_SELLER"));
        TbSeller seller = sellerService.findOne(username);

        if (seller != null) {
            if (seller.getStatus().equals("1")) {
                return new User(username, seller.getPassword(), authorities);
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}
```

配置文件：

```xml
<authentication-manager>
    <authentication-provider user-service-ref="UserDetailsService">
        <password-encoder ref="bcryptEncoder"></password-encoder>
    </authentication-provider>
</authentication-manager>

<beans:bean id="UserDetailsService" class="com.pinyougou.service.UserDetailsServiceImpl">
    <beans:property name="sellerService" ref="sellerService"></beans:property>
</beans:bean>

<!-- BCrypt 加密实现类 -->
<beans:bean class="org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder" id="bcryptEncoder"></beans:bean>
```

**密码加密存储**

在 Controller 里这样处理：

```java
public Result add(@RequestBody TbSeller seller) {
    BCryptPasswordEncoder passwordLock = new BCryptPasswordEncoder();
    String newPassWord = passwordLock.encode(seller.getPassword());
    seller.setPassword(newPassWord);
    try {
        sellerService.add(seller);
        return new Result(true, "增加成功");
    } catch (Exception e) {
        return new Result(false, "增加失败");
    }
}
```

BCrypt 会自动把原密码加密存储，登录时自动匹配，无需解密。
