---
title: 如何正方形旋转起来？
group: 正方形系列
order: 1
---

## 代码解析

我们需要使用 `requestAnimationFrame` 来实现动画，它会在浏览器下一次重绘之前调用指定的回调函数。增加一个变量 `squareRotation` 来控制正方形的旋转角度。

```ts
let then = 0;

// Draw the scene repeatedly
function render(now) {
  now *= 0.001; // convert to seconds
  deltaTime = now - then;
  then = now;

  drawScene(gl, programInfo, buffers, squareRotation);
  squareRotation += deltaTime;

  requestAnimationFrame(render);
}
requestAnimationFrame(render);
```

然后我们使用 `mat4.rotate` 来实现正方形的旋转。

```ts
function drawScene(gl, programInfo, buffers, squareRotation) {
  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    squareRotation, // amount to rotate in radians
    [0, 0, 1],
  ); // axis to rotate around
}
```

<code src="../demos/rect/animation/index.tsx" ></code>
