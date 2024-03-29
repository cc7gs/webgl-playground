---
title: 如何绘制一个点？
group:
  title: 绘制点
  order: 1
---

## 绘制一个点

我们绘制流程如下:

1. 获取 `<canvas>` 元素
2. 获取 WebGL 上下文
3. 初始化着色器
4. 设置 `<canvas>` 的背景色
5. 清除 `<canvas>` 的颜色缓冲区
6. 绘图

<code src="../demos/point/basic-1.tsx" ></code>

目前我们已经画了一个点，但是目前点的大小、颜色都是写死的；那么该如何和 JavaScript 进行数据通信呢？

## 给着色器传递数据

我们目标是将位置、大小和颜色信息从 JavaScript 程序中传给顶点着色器与片段着色器。我们将使用到 attribute 与 uniform 变量。

<code src="../demos/point/basic.tsx"></code>

### attribute 变量 与 uniform 变量使用场景

- attribute 变量：传输的那些与顶点相关的数据
- uniform 变量：与顶点数据无关的数据

更多细节可以 [查看](/playground/glsles#全局变量与局部变量)
