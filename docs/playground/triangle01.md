---
title: 如何绘制一个三角形？
group:
  title: 三角形系列
  order: 0
---

基于上一节教程，我们已经学会了如何绘制多个点。基于上面代码，我们只需要将 ` gl.drawArrays(gl.POINTS, 0, n);` 改为 ` gl.drawArrays(gl.TRIANGLES, 0, n);` 即可绘制一个三角形。

<code src="../demos/triangle/01.tsx" ></code>
