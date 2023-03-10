---
title: 如何实现动画？
group:
  title: 三角形系列
order: 3
---

## 动画

动画就是在一定的时间内，不断的改变图形的状态，从而产生动态的效果。我们可以通过改变顶点的坐标来实现动画效果。下图我们来实现一个简单的动画，通过改变三角形的坐标，让它不断的旋转。

首先我们需要定义一个变量来保存当前的角度，然后在每一帧中，我们将角度增加一点，然后重新绘制三角形，就可以实现动画效果了。

```ts
function main(canvas: HTMLCanvasElement) {
  // ... 省略其他代码
  let currentAngle = 0;
  function tick() {
    currentAngle = animate(currentAngle);
    draw(gl!, n, currentAngle, programInfo);
    requestAnimationFrame(tick);
  }
  tick();
}

// 绘制三角形
function draw(
  gl: WebGLRenderingContext,
  n: number,
  angle: number,
  programInfo: {
    program: WebGLProgram;
    uniformLocations: Record<string, WebGLUniformLocation | null>;
  },
) {
  // 设置旋转矩阵
  const modelViewMatrix = mat4.create();
  mat4.rotateZ(modelViewMatrix, modelViewMatrix, angle);
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.uModelFormMatrix,
    false,
    modelViewMatrix,
  );
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}
```

上面我们使用`requestAnimationFrame`来实现动画，它会在浏览器下一次重绘之前调用我们的回调函数，这样就可以保证动画的流畅性。因为每次绘制时间间隔不是固定的，所以我们需要定义一个变量来保存上一次调用的时间，然后在每一帧中，计算距离上次调用经过了多长时间，然后根据这个时间来更新旋转角度。

```ts
/**
 *
 * @param angle 旋转角度
 * @returns {number} 更新后的旋转角度
 */
function animate(angle: number) {
  const now = Date.now();
  // 计算距离上次调用经过多长时间
  const elapsed = now - lastTime;
  lastTime = now;
  // 更新旋转角度
  const newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle % 360;
}
```

<code src="../demos/triangle/rotating.tsx"></code>
