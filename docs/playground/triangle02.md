---
title: 如何进行平移、旋转和缩放？
group:
  title: 三角形系列
---

## 平移

平移就是将每一个顶点的坐标都加上一个固定的值，这样就可以实现平移的效果。如下图所示，将三角形沿着 x 轴平移 0.5，沿着 y 轴平移 0.5。首先我们在顶点着色器中定义一个 uniform 变量（uTranslation;），用来接收平移的值。然后在片元着色器中将顶点的坐标加上 uTranslation 的值，就可以实现平移的效果。即：

```text
 attribute vec4 aVertexPosition;
 uniform vec4 uTranslation;
 void main(){
    gl_Position = aVertexPosition+uTranslation;
  }
```

<code src="../demos/triangle/translate.tsx"></code>

## 旋转

如果我们要旋转一个物体，那么我们必须指明旋转轴、选择方向和旋转角度。在 WebGL 中，我们可以通过旋转矩阵来实现旋转。旋转矩阵是一个 4x4 的矩阵，它的值是固定的，我们只需要根据旋转轴、选择方向和旋转角度来计算出旋转矩阵的值，然后将它传递给顶点着色器，就可以实现旋转的效果。如下图所示，我们将三角形绕着 z 轴旋转 45 度。

a 是 x 轴的旋转到点 p 的角度，因此我们可以计算出 p 的坐标：

```text
x=r*cos(a)
y=r*sin(a)
```

类比，我们可以使用 a、b 和 r 计算出 p'的坐标：

```text
x'=cos(a+b)*r
y'=sin(a+b)*r
```

当我们旋转 45 度时，则 x'、y'如下：

```text
x'=cos(45)*x-sin(45)*y
y'=sin(45)*x+cos(45)*y
```

<code src="../demos/triangle/rotate.tsx"></code>

## 缩放
