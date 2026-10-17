---
title: "My Ruby Notes, Part 1: Basic Syntax"
description: "Common data types include strings, numbers, booleans, arrays, and hashes. For naming, constants use uppercase letters, ordinary variables generally use lowercase names, and classes and modules use capitalized CamelCase. These are my notes on Ruby's basic syntax…"
date: 2021-06-21
lang: en
translationKey: "2021-06-21_553_我的Ruby心得笔记 (一)：基础语法"
categories:
  - "Backend"
  - "Deep Dive"
views: 8457
draft: false
---

![v2-9765e9b4343a30b5fb43b3a227888221_720w.png](https://static.yinzhuoei.com/typecho/2021/06/21/808552152031046/v2-9765e9b4343a30b5fb43b3a227888221_720w.png)

# Data Types

1. string
2. number
3. boolean
4. array
5. hash

These are some common data types.

# Naming Conventions

Constants use all uppercase letters.

```ruby
VERSION = "v1"
```

For ordinary variables, setting aside prefixes such as @ and @@, lowercase names are generally all we need.

```ruby
age = 12;
user_name = "seho";
```

Class and module names start with a capital letter and use CamelCase.

```ruby
class Apple
```

Method names start with a lowercase letter and can end with = or ?.

```ruby
def show
end

def index=
end
```

# Writing Classes

In Ruby, everything—including strings and numbers—is an object.

```ruby
class Api
  def show
    @article = "hello";
    color = "red";
    render_ajax_success({ msg: "123", text: color, age: age, name: name })
  end

  def index
    @article = "hello"
  end
end
```

The name starts with a capital letter, and the definition starts with class and finishes with end. The filename matches the class name, converted to lowercase with underscores between words.

There is a simpler way to declare attributes in a class that automatically creates their getter and setter methods:

```ruby
attr_accessor "color"
attr_accessor "age"
attr_accessor "name"
```

Classes also have an initialize method, where we can define what happens when an instance is created.

Ruby supports private and public methods, too.

```ruby
private
def getName

end
```

The private keyword marks methods as private; methods without a visibility modifier are generally public. Private methods are usually placed below public methods in a class.

# Assignment

Unlike Java, Ruby does not require you to declare a variable's type before assigning a value. Just assign it directly.

```ruby
age = 13;
name = "seho";
```

# String Interpolation

In JavaScript, we can use + to concatenate variables. Ruby lets us do the same.

```ruby
age = "13"
name = "seho"
puts age + name;
```

But concatenating values of different types produces an error, because Ruby does not know how to convert them automatically. That is where string interpolation comes in.

```ruby
age = 13
puts "name: #{age}"
```

# Kinds of Variables

Class variables

```ruby
# 多个实例都会共享的变量
@@age = 123;
A.new.@@age; # 123
B.new.@@age; # 123
```

Instance variables

```ruby
# 作用域是class类中，在ruby中广泛使用
@name = “seho”;
```

Local variables

```ruby
# 作用域是在方法内
name = "seho"
```

Global variables

```ruby
# 全局都可以使用的变量，不常用
$version = "v1";
```

# Methods

Class methods

```ruby
class A
    def A.show
    @article = "hello";
  end
end
```

Instance methods

```ruby
class A
    def show
    @article = "hello";
  end
end
```

They are called differently:

```ruby
A.show
A.new.show
```

# Symbols

JavaScript also gained this data type in ES6. In Ruby, symbols represent immutable names and are commonly used as hash keys. To write one, simply put a colon before its name.

```ruby
:age = number;
# 声明一个hash，最需要用到symbol
time = {
    :name: "seho"
}
```

# Arrays

```ruby
num = [1,2,3,4]
# 数据类型混合着来
test = ["1",2, "1", :name, {:name: "seho"}]
```

# Hashes

There are three ways to write a hash.

```ruby
jim = {
    :name => "jim",
    :age => 20
}
```

```ruby
# 1.9之后产生的新写法
jim = {
    name: "hello",
    age: 20
}
```

```ruby
# 也可以写成
jim = {}
jim[:name] = "jim"
jim[age] = 20
```

Strings and symbols are different hash keys. For example:

```ruby
jim = {
    :name: 1,
    name: 2
}

a[:name] #=> 1
a["name"] #=> 2
```

# Conditionals

```ruby
# if else end是最常见的
a = 1;
if a == 1
    puts "a is 1"
elseif a == 2
    puts "a is 2"
else
    puts "is not"
end
```

There is also the case statement.

```ruby
a = 1;
case a
    when 1 then puts "a is 1"
    when 3,4,5 then puts "a is [3,4,5]"
    else puts "a is not in there"
end
```

The ternary operator

```ruby
a = 1
puts a == 1 ? "one" : "not one"
```

# Loops

```ruby
# for
[1,2,3].each { |e| 
    puts e;
}

# 等同于下方
for e in [1,2,3]
    puts e
end
```

The for loop and each are almost equivalent. The former is a keyword, while the latter is an array method. Experienced Ruby developers tend to use each. There is a similarity to JavaScript here: the e variable in a for loop remains accessible outside the loop, whereas the block variable in each stays local to the block.

```ruby
# loop
loop do
 # code
 break if 表达式
end

# while
begin
 # code
end while 表达式
```

I recommend loop because it reads more clearly. Even as someone unfamiliar with Ruby, I prefer it because its meaning is immediately obvious, whereas the while form feels more awkward.
