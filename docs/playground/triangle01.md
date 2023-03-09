---
title: 如何绘制一个三角形？
group:
  title: 三角形系列
  order: 1
order: 0
---

基于上一节教程，我们已经学会了如何绘制多个点。基于上面代码，我们只需要将 ` gl.drawArrays(gl.POINTS, 0, n);` 改为 ` gl.drawArrays(gl.TRIANGLES, 0, n);` 即可绘制一个三角形。

<code src="../demos/triangle/basic.tsx" ></code>

## 总结

绘制三角形核心在于 `drawArrays` 函数，它的第一个参数是绘制模式，第二个参数是起始点，第三个参数是点的个数。在这个例子中，我们使用 `gl.TRIANGLES` 模式，起始点是 0，点的个数是 3，这样就可以绘制一个三角形了。

可以尝试更改绘制模式，看看会有什么效果。

## 拓展

我们更改绘制模式为 `gl.TRIANGLE_STRIP`，点数为 4，点的坐标`[-0.5, 0.5, -0.5, -0.5, 0.5, 0.5,0.5,-0.5]` 即可绘制一个矩形。

<code src="../demos/rect/rect1.tsx" ></code>
