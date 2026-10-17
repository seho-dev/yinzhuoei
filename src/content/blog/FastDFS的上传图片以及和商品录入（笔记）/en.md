---
title: "Image Uploads with FastDFS and Product Entry: Study Notes"
description: "Querying product categories: retrieve child categories by parent ID, passing 0 during frontend initialization to fetch top-level categories. Breadcrumb navigation uses levels 1, 2, and 3. HTML and list-button handlers connect category selection to navigation…"
date: 2018-12-16
lang: en
translationKey: "2018-12-16_75_FastDFS的上传图片以及和商品录入（笔记）"
categories:
  - "Backend"
views: 5334
draft: false
---

![u=2703915976,3722517054&fm=26&gp=0.jpg](https://www.yinzhuoei.com/usr/uploads/2018/12/1572834981.jpg)

**Querying Product Categories**

Query child categories by parent ID:

```java
public List<TbItemCat> getItemByParentId(Long parentId) {
    TbItemCatExample example = new TbItemCatExample();
    Criteria createCriteria = example.createCriteria();
    createCriteria.andParentIdEqualTo(parentId);
    return itemCatMapper.selectByExample(example);
}
```

Pass 0 when initializing the frontend to retrieve the top-level categories:

```html
ng-init="selectByParentId(0)"
```

**Breadcrumb Navigation**

Breadcrumb levels: 1 for the first level, 2 for the second, and 3 for the third.

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

HTML:

```html
<li><a ng-click="grade=1;selectGrade({id:0})">Top-level categories</a></li>
<li><a ng-click="grade=2;selectGrade(entity_1)">{{entity_1.name}}</a></li>
<li><a ng-click="grade=3;selectGrade(entity_2)">{{entity_2.name}}</a></li>
```

List-button click handler: `ng-click="setGrade(grade+1);selectGrade(entity)"`

**Product Entry**

You need to understand SPU and SKU. The composite model is:

```java
private TbGoods goods;           // SPU
private TbGoodsDesc goodsDesc;    // Additional information
private List<TbItem> itemList;   // SKU list
```

Service layer:

```java
public void add(Goods goods) {
    goods.getGoods().setAuditStatus("0");
    goodsMapper.insert(goods.getGoods());
    goods.getGoodsDesc().setGoodsId(goods.getGoods().getId());
    goodsDescMapper.insert(goods.getGoodsDesc());
}
```

Rich-text editor:

```javascript
var editor;
KindEditor.ready(function(K) {
    editor = K.create('textarea[name="content"]', {
        allowFileManager: true
    });
});
```

**FastDFS Distributed File Server**

Backend upload:

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
        return new Result(false, "Upload failed");
    }
}
```

Frontend upload:

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

Controller layer:

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
