---
title: 通过鼠标点击绘制点
group: 绘制点
order: 1
---

# 通过鼠标点击绘制点

在上面一节基础版上，我们知道了如何更改点的位置、大小与颜色信息。现在我们做一个通过鼠标点击绘制点的例子。

:::info{title=提示}
用鼠标点击画布，可以绘制点。
:::

<code src="../demos/point/advance.tsx" ></code>

## 代码解析

核心代码即 `canvasClick` 函数，你可能会有疑问我们为什么要将点位置、与位置颜色存为全局变量？这是因为 WebGL 使用的是颜色缓冲区。在绘制结束后系统会将缓冲区的内容绘制到屏幕上，然后颜色缓冲区会被重置，其中内容会丢失。如果我们不将点的位置、颜色信息存为全局变量，那么每次点击鼠标都会重新绘制一次，这样会导致之前绘制的点消失。

**备注：** 这也就解释了，为什么你示例中每次绘制一个点后，大小都会变大。因为大小没有被存为全局变量。

## 浏览器、canvas 与 webGL 坐标系的差异

https://www.yuque.com/mashimaro-qhlzj/wccmw/in7nditicc3ba7nz#ILHaP

![图解坐标系差异](https://cdn.nlark.com/yuque/0/2023/png/1393701/1689496204153-5a1a800d-88b2-43c6-b423-11827387ae7d.png)

> 图片来源：https://blog.csdn.net/u011332271/article/details/110477155

下面我们看看`chatGPT`回答:

![chatGPT 回答](https://cdn.nlark.com/yuque/0/2023/png/1393701/1677578165252-ce408582-e7fd-4c29-be7a-ff4f8c6e3cca.png?x-oss-process=image%2Fresize%2Cw_1332%2Climit_0)
