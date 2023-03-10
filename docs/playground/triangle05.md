---
title: 如何添加颜色？
group:
  title: 三角形系列
order: 4
---

## 彩色三角形

在上一篇教程中，我们绘制了一个三角形，但是三角形的颜色都是一样的，那么该如何为三角形添加颜色呢？本文我们将给三角形每个顶点添加颜色，然后 WebGL 会自动进行插值，最终我们将得到一个彩色的三角形。
在[绘制多点文章](./point03.md)中，我们已经学习了片元着色器与顶点着色器之间通过`varying`变量进行通信，关于通信的内容，我们不再赘述，这里我们直接上代码。

### 三角形如何被绘制的？

我们已经知道，将顶点坐标写入缓冲区对象，然后缓冲区对象分配给`attribute`变量，最后将缓冲区对象中的数据传递给顶点着色器，当顶点着色器执行完毕后，WebGL 会自动将顶点着色器的输出作为片元着色器的输入，然后片元着色器会根据顶点着色器的输出进行插值，最终得到一个三角形。

可是我们还是不明白，我们给出了三个顶点的坐标时，片元着色器是如何知道这三个顶点组成了一个三角形的呢？这里我们需要了解一下`绘制过程`。大致流程如下：

顶点坐标 -> 图形装配 -> 光栅化 -> 片元着色器 -> 像素处理 -> 像素输出

**图形装配过程**：在图形装配阶段，WebGL 会根据顶点坐标，将顶点组合成图形。图形类型由`gl.drawArrays`方法的第一个参数决定，比如：`gl.drawArrays(gl.TRIANGLES, 0, 3)`，这里的`gl.TRIANGLES`表示绘制三角形，因此 WebGL 会根据顶点坐标，将三个顶点组合成一个三角形。
**光栅化过程**：在光栅化阶段，WebGL 会根据图形装配阶段的结果，将图形转换为像素点，然后将像素点传递给片元着色器。
**片元着色器过程**：在片元着色器阶段，WebGL 会根据光栅化阶段的结果，将像素点传递给片元着色器，然后片元着色器会根据顶点着色器的输出进行插值，最终得到一个三角形。

### 代码实现

1. 首先我们需要借助`varying`变量，将顶点着色器的输出传递给片元着色器，然后在片元着色器中，将`varying`变量的值赋值给`gl_FragColor`变量。

```ts
// 顶点着色器片段
const vsSource = `
      attribute vec4 aVertexPosition;
      attribute vec4 aVertexColor;
      varying vec4 vColor;

      void main(){
          gl_Position = aVertexPosition;
          vColor = aVertexColor;
      }
  `;
// 片元着色器片段
const fsSource = `
  varying lowp vec4 vColor;
  
  void main(){
      gl_FragColor = vColor;
  }
  `;
```

2. 我们需要定义顶点的坐标与颜色

```ts
// prettier-ignore
const vertices = new Float32Array([
  0.0, 0.5, 1.0, 0.0, 0.0, 1.0,
 -0.5, -0.5, 0.0, 1.0, 0.0, 1.0,
  0.5, -0.5, 0.0, 0.0, 1.0, 1.0,
]);
```

3. 将顶点坐标与颜色写入缓冲区对象

```ts
// ... 省略其他代码
const FSIZE = verticesColors.BYTES_PER_ELEMENT;

// 获取attribute变量的存储位置
const aPosition = gl.getAttribLocation(program, 'aVertexPosition');
// 将缓冲区对象分配给aPosition变量
gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, FSIZE * 6, 0);
// 连接aPosition变量与分配给它的缓冲区对象
gl.enableVertexAttribArray(aPosition);

const aColor = gl.getAttribLocation(program, 'aVertexColor');
gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, FSIZE * 6, FSIZE * 2);
gl.enableVertexAttribArray(aColor);
```

到此我们已经完成了彩色三角形的绘制，下面我们来看一下效果。

<code src="../demos/triangle/triangleColor.tsx" ></code>

是不是很好奇，为什么明明我们只指定了三个点的颜色，但是最终绘制出来的三角形却有很多颜色？这是因为 WebGL 会根据顶点着色器的输出进行插值，最终得到一个三角形。

### 内插过程

如果我们有一条线，两端颜色分别为红色（1.0,0.0,0.0），与蓝色(0.0,0.0,1.0)。则 RGBA 中的 R 从 1.0 到 0.0，B 从 0.0 到 1。线段上每个像素点的颜色都会被恰当的计算出来，这就是内插过程。
