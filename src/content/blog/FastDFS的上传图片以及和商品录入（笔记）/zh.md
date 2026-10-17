---
title: "FastDFS的上传图片以及和商品录入（笔记）"
description: "商品分类查询 根据父 ID 查询子分类： 前端初始化时传 0 查询父级： 面包屑功能 面包屑层级：一级是 1，二级是 2，三级是 3。 HTML： 点击列表按钮：ng-click=\"setGrade(grade+1);selectGrade(entity)\"…"
date: 2018-12-16
lang: zh
translationKey: "2018-12-16_75_FastDFS的上传图片以及和商品录入（笔记）"
categories:
  - "后端"
views: 5334
draft: false
---

![u=2703915976,3722517054&fm=26&gp=0.jpg](https://www.yinzhuoei.com/usr/uploads/2018/12/1572834981.jpg)

**商品分类查询**

根据父 ID 查询子分类：

```java
public List<TbItemCat> getItemByParentId(Long parentId) {
    TbItemCatExample example = new TbItemCatExample();
    Criteria createCriteria = example.createCriteria();
    createCriteria.andParentIdEqualTo(parentId);
    return itemCatMapper.selectByExample(example);
}
```

前端初始化时传 0 查询父级：

```html
ng-init="selectByParentId(0)"
```

**面包屑功能**

面包屑层级：一级是 1，二级是 2，三级是 3。

```javascript
$scope.grade = 1;

$scope.setGrade = function(value) {
    $scope.grade = value;
}

$scope.selectGrade = function(p_entity) {
    if ($scope.grade === 1) {
        $scope.entity_1 = null;
        $scope.entity_2 = null;
    }
    if ($scope.grade === 2) {
        $scope.entity_1 = p_entity;
        $scope.entity_2 = null;
    }
    if ($scope.grade === 3) {
        $scope.entity_2 = p_entity;
    }
    $scope.selectByParentId(p_entity.id)
}
```

HTML：

```html
<li><a ng-click="grade=1;selectGrade({id:0})">顶级分类列表</a></li>
<li><a ng-click="grade=2;selectGrade(entity_1)">{{entity_1.name}}</a></li>
<li><a ng-click="grade=3;selectGrade(entity_2)">{{entity_2.name}}</a></li>
```

点击列表按钮：`ng-click="setGrade(grade+1);selectGrade(entity)"`

**商品录入**

需要理解 SPU 和 SKU 的概念。组合表：

```java
private TbGoods goods;           // SPU
private TbGoodsDesc goodsDesc;    // 扩展信息
private List<TbItem> itemList;   // SKU 列表
```

Service 层：

```java
public void add(Goods goods) {
    goods.getGoods().setAuditStatus("0");
    goodsMapper.insert(goods.getGoods());
    goods.getGoodsDesc().setGoodsId(goods.getGoods().getId());
    goodsDescMapper.insert(goods.getGoodsDesc());
}
```

富文本编辑器：

```javascript
var editor;
KindEditor.ready(function(K) {
    editor = K.create('textarea[name="content"]', {
        allowFileManager: true
    });
});
```

**FastDFS 分布式文件服务器**

后端上传：

```java
@RequestMapping("upload")
public Result upload(MultipartFile file) {
    String OriginalFilename = file.getOriginalFilename();
    String name = OriginalFilename.substring(OriginalFilename.lastIndexOf(".") + 1);
    try {
        FastDFSClient client = new FastDFSClient("classpath:config/fdfs_client.conf");
        String fileName = client.uploadFile(file.getBytes(), name);
        String url = images_server_url + fileName;
        return new Result(true, url);
    } catch (Exception e) {
        return new Result(false, "上传失败");
    }
}
```

前端上传：

```javascript
this.upload = function() {
    var formData = new FormData();
    formData.append("file", file.files[0]);
    return $http({
        url: '../upload.do',
        method: "POST",
        data: formData,
        headers: { 'Content-Type': undefined },
        transformRequest: angular.identity
    })
}
```

控制层：

```javascript
$scope.upload = function() {
    $scope.imageEntity = {}
    uploadFile.upload().success(function(response) {
        if (response.success) {
            $scope.imageEntity.url = response.message
        }
    })
}

$scope.entity = { goods: {}, goodsDesc: { itemImages: [] } }

$scope.addImgList = function() {
    $scope.entity.goodsDesc.itemImages.push($scope.imageEntity)
}

$scope.deleImgList = function(index) {
    $scope.entity.goodsDesc.itemImages.splice(index, 1);
}
```
