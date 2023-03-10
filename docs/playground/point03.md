---
title: 如何绘制多个点？
group: 绘制点
order: 2
---

在上面教程中，我们一次只绘制了一个点，对于那么由多个顶点组合成图形，比如：正方形、三角形来说，我们需要一次将图形的顶点传递给顶点着色器，然后在顶点着色器中将顶点组合成图形。因此我们需要借助`缓冲区对象`来完成。

<code src="../demos/point/multiPoints.tsx" ></code>

## 缓冲区对象

缓冲区对象是 WebGL 系统的一块内存区域，它可以存储多个顶点的数据，然后将数据传递给顶点着色器。

### 颜色绘制

上面示例，我们绘制了多个点，但是每个点的颜色都是一样的；现在我们来使用`varying`变量来为每个点设置不同的颜色。

我们需要修改着色器片段，将`varying`变量传递给片元着色器，然后在片元着色器中使用`varying`变量来设置颜色。

```ts
// 顶点着色器片段
const vsSource = `
      attribute vec4 aVertexPosition;
      attribute vec4 aVertexColor;
      varying lowp vec4 vColor;

      void main(){
          gl_Position = aVertexPosition;
          gl_PointSize = 10.0;
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

然后我们需要修改顶点数据，为每个顶点设置颜色。

```ts
// prettier-ignore
const vertices = new Float32Array([
  0.0, 0.5, 1.0, 0.0, 0.0, 1.0,
 -0.5, -0.5, 0.0, 1.0, 0.0, 1.0, 
  0.5, -0.5, 0.0, 0.0, 1.0, 1.0,
]);
```

这里我们将每个顶点的颜色数据放在了顶点数据的后面，因此我们需要修改顶点着色器中的`attribute`变量的位置。

```ts
const FSIZE = vertices.BYTES_PER_ELEMENT;
const aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
gl.vertexAttribPointer(aVertexPosition, 2, gl.FLOAT, false, FSIZE * 6, 0);
gl.enableVertexAttribArray(aVertexPosition);

const aVertexColor = gl.getAttribLocation(program, 'aVertexColor');
gl.vertexAttribPointer(aVertexColor, 4, gl.FLOAT, false, FSIZE * 6, FSIZE * 2);
gl.enableVertexAttribArray(aVertexColor);
```

<code src="../demos/point/multiAttributeColor.tsx" ></code>

## 总结

此时我们已经学会了如何绘制一个点，以及如何绘制多个点。在下一节教程中，我们将学习如何绘制三角形。
