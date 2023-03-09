---
title: 如何实现复杂变换？
group:
  title: 三角形系列
order: 2
---

## 复合变换

接下来我们来实现一个复杂的变换，如下图所示，我们将三角形绕着 z 轴旋转 45 度，然后沿着 x 轴平移 0.5，沿着 y 轴平移 0.5。我们可以将这个变换分解为两个变换，首先是旋转，然后是平移。我们可以将旋转和平移的矩阵相乘，得到一个新的矩阵，然后将这个新的矩阵应用到顶点上，就可以实现复杂的变换。

旋转后平移的矩阵=平移矩阵*旋转矩阵*原始坐标，因此我们只需要算出`平移矩阵*旋转矩阵`，然后将这个矩阵应用到顶点上，就可以实现旋转后平移的效果。注意，这里的矩阵相乘顺序是从右往左，即`平移矩阵*旋转矩阵`，而不是`旋转矩阵*平移矩阵`。

```ts
// 旋转45度,然后平移（0.5,0.5）
const modelViewMatrix = mat4.create();
mat4.translate(modelViewMatrix, modelViewMatrix, [0.5, 0, 0]);
mat4.rotateZ(modelViewMatrix, modelViewMatrix, (45 * Math.PI) / 180);
```

<code src="../demos/triangle/rotateAndTranslate.tsx"></code>
