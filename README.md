# CKMenu.js
一个简单的网页右键菜单js，练手项目。
在Chrome浏览器等支持`backdrop-filter`属性的浏览器中可以有模糊背景效果。

## 用法

### 初始化
```js
var m = new CKMenu();
m.bind(document.getElementById("targetElement"));//指定要对谁响应右键菜单
```
*绑定后对应元素的右键菜单将失去原本功能，只显示此JS显示的右键菜单。*
### 添加菜单

**添加一个选项**
```js
m.addOption("测试",()=>alert("测试"));
```

**添加一条横线**
```js
m.addLine();
```

**添加一个分段标题**
```js
m.addTitle("示例");
```

### 更多选项

**在创建右键菜单前执行**
```js
m.config.beforeCall = (event,menuObj)=>{
  // Code ...
}
```
* **event**: 此次右键的事件

**在关闭右键菜单后执行**
```js
m.config.afterCall = ()=>{
  // Code ...
}
```

**修改动画** *(TODO)*
```js
m.config.animation = : "Fade",//Fade,Scale,Expand
```
