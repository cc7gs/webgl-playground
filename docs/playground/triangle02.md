---
title: 如何进行平移、旋转和缩放？
group:
  title: 三角形系列
order: 1
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

如果我们要旋转一个物体，那么我们必须指明旋转轴、选择方向和旋转角度。如下图所示，我们将三角形绕着 z 轴旋转 45 度。

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

<code src="../demos/triangle/rotate01.tsx"></code>

## 变换矩阵

对于简单的旋转，我们可以使用数学表达式来实现。但是如果情况比较复杂（比如：旋转后平移），我们需要对情况叠加获取新的表达式。此时就比较繁琐。因此对于上面的旋转公式，我们可以将它用变换矩阵来表示。如下图所示，我们将三角形绕着 z 轴旋转 45 度。

`x'=cos(45)*x-sin(45)*y`,那么转化为矩阵表示为：`x'=ax+by+cz`，我们假设 a=cos(45),b=-sin(45),c=0。那么我们两个等式就相等了，同理`y'`,最后我们可以得到一个矩阵：

```text
[x']   [cos(45) -sin(45) 0]   [x]
[y'] = [sin(45)  cos(45) 0] * [y]
[z']    [0        0       1]   [z]
```

<code src="../demos/triangle/rotate02.tsx"></code>

上面的变换矩阵我们只是一次旋转，因此也称为`旋转矩阵`。当然我们也可以使用变换矩阵表示平移和缩放等其它变换。

### 平移矩阵

x'=x+tx,y'=y+ty,z'=z+tz，该矩阵的乘法表示

```text
[x']   [a,b,c,d]   [x]
[y'] = [e,f,g,h] * [y]
[z']   [i,j,k,l]   [z]
[1]    [m,n,o,p]   [1]
```

则 `x'=ax+by+cz+d`,`y'=ex+fy+gz+h`,`z'=ix+jy+kz+l`;带入我们的值我们可以得出：
a=1,b=0,c=0,d=tx,e=0,f=1,g=0,h=ty,i=0,j=0,k=1,l=tz,m=0,n=0,o=0,p=1。最终我们可以得到一个矩阵：

```text
[x']   [1 0 0 tx]   [x]
[y'] = [0 1 0 ty] * [y]
[z']    [0 0 1 tz]   [z]
[1]     [0 0 0 1]    [1]
```

### 旋转矩阵

x'=x*cos(a)-y*sin(a),y'=x*sin(a)+y*cos(a),z'=z;该矩阵的乘法表示

```math
[x']   [a,b,c,d]   [x]
[y'] = [e,f,g,h] * [y]
[z']   [i,j,k,l]   [z]
[1]    [m,n,o,p]   [1]
```

则 `x'=ax+by+cz+d`,`y'=ex+fy+gz+h`,`z'=ix+jy+kz+l`;带入我们的值我们可以得出：
a=cos(a),b=-sin(a),c=0,d=0,e=sin(a),f=cos(a),g=0,h=0,i=0,j=0,k=1,l=0,m=0,n=0,o=0,p=1。最终我们可以得到一个矩阵：

```text
[x']   [cos(a) -sin(a) 0 0]   [x]
[y'] = [sin(a)  cos(a) 0 0] * [y]
[z']    [0        0     1 0]   [z]
[1]     [0        0     0 1]   [1]
```

### 缩放矩阵

x'=x*sx,y'=y*sy,z'=z\*sz;该矩阵的乘法表示

```text
[x']   [a,b,c,d]   [x]
[y'] = [e,f,g,h] * [y]
[z']   [i,j,k,l]   [z]
[1]    [m,n,o,p]   [1]
```

则 `x'=ax+by+cz+d`,`y'=ex+fy+gz+h`,`z'=ix+jy+kz+l`;带入我们的值我们可以得出：
a=sx,b=0,c=0,d=0,e=0,f=sy,g=0,h=0,i=0,j=0,k=sz,l=0,m=0,n=0,o=0,p=1。最终我们可以得到一个矩阵：

```text
[x']   [sx 0  0  0]   [x]
[y'] = [0  sy 0  0] * [y]
[z']    [0  0  sz 0]   [z]
[1]     [0  0  0  1]   [1]
```

## 缩放

基于缩放矩阵，我们让三角形放大 1.5 倍，我们修改代码:

```typescript
const sx = 1.5,
  sy = 1.5,
  sz = 1.5;
// prettier-ignore
const formMatrix = new Float32Array([
  sx,0,0,0,
  0,sy,0,0,
  0,0,sz,0,
  0,0,0,1,
]);
```

<code src="../demos/triangle/scale.tsx"></code>

## 总结

我们学会了使用矩阵来表示变换，以及如何使用矩阵来实现平移、旋转、缩放等变换。矩阵在计算机图形学中非常重要，我们后面的教程会广泛使用它，不过为了隐藏其中的数学细节我们后续会使用 [`gl-matrix`](https://www.npmjs.com/package/gl-matrix) 库来代替我们手动编写矩阵。
下一章让一起来学习如何使用矩阵来实现更复杂的变换吧。
