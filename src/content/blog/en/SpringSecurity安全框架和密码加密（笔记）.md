---
title: "Spring Security and Password Hashing: Study Notes"
description: "I learned about Spring Security today, so here are the key points and pitfalls. Spring Security is a security framework used primarily for authentication, offering security and performance while reducing development work. Basic configuration: pattern identifies resources, access specifies the required role, and the ROLE_ prefix is mandatory…"
date: 2018-12-16
lang: en
translationKey: "2018-12-16_74_SpringSecurity安全框架和密码加密（笔记）"
categories:
  - "Backend"
views: 5381
draft: false
---

![timg (1).jpg](https://www.yinzhuoei.com/usr/uploads/2018/12/367711948.jpg)

I learned about Spring Security today. Here are the key points and the pitfalls I encountered.

Spring Security is a security framework used primarily for authentication. It provides security and performance while reducing development work.

**Basic Configuration**

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

`pattern` identifies resources that bypass security interception, while `access` specifies the required role. The `ROLE_` prefix is mandatory. The framework automatically generates a login page.

**A Custom Login Page**

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

**Frontend Form Requirements**

- action: `/login`
- method: POST
- Username field name: `username`
- Password field name: `password`

**Database Lookup + Password Hashing**

Implement the `UserDetailsService` interface to query the database:

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

Configuration:

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

**Storing Hashed Passwords**

Handle it in the controller like this:

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

BCrypt hashes the original password for storage and automatically checks it at login. No decryption is needed.
