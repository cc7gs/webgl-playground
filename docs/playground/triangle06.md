---
title: 如何添加纹理？
group:
  title: 三角形系列
order: 5
---

## 什么是纹理？

纹理是一种用于增加图形细节的技术，它可以将一个图像映射到一个几何形状上。纹理通常用于为三维对象赋予表面颜色和图案，使其看起来更真实。

纹理可以使用以下步骤创建和应用：

1. 创建纹理对象：使用 WebGL 的 `createTexture` 函数创建一个纹理对象，并返回一个唯一的纹理 ID。
2. 绑定纹理：使用 WebGL 的`bindTexture`函数将纹理对象绑定到 WebGL 上下文的纹理单元上。
3. 加载纹理图像：使用 WebGL 的`texImage2D`函数将一个或多个图像加载到纹理对象中。通常情况下，可以使用 HTMLImageElement、HTMLVideoElement 或 HTMLCanvasElement 对象作为纹理图像。
4. 配置纹理参数：使用 WebGL 的`texParameter` 函数配置纹理对象的一些参数，如纹理过滤器、纹理环绕方式等。
5. 使用纹理：将纹理对象传递给着色器程序，通过在片元着色器中使用纹理坐标，将纹理映射到几何形状的表面上。

### 纹理坐标

纹理坐标是指用于将纹理映射到几何形状表面上的二维坐标。每个顶点都可以有一个纹理坐标，纹理坐标的范围通常是(0,0)到(1,1)之间。纹理坐标的原点是纹理图像的左下角，而不是左上角。

## 给三角形添加纹理

程序也分为五步：

1. 给顶点着色器添加纹理坐标属性，光栅化后传递给片元着色器。

```ts
// 顶点着色器片段
const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;
   varying vec2 vTextureCoord;

    void main(){
        gl_Position = aVertexPosition;
       vTextureCoord = aTextureCoord;
    }
`;
// 片元着色器片段
const fsSource = `
  uniform sampler2D uSampler;
  varying mediump vec2 vTextureCoord;
void main(){
    gl_FragColor = texture2D(uSampler, vTextureCoord);
}
`;
```

2. 片元着色器根据纹理坐标从纹理中采样颜色。
3. 设置顶点的纹理坐标（initVertexBuffers()）

```ts
function initVertexBuffer(gl: WebGLRenderingContext, program: WebGLProgram) {
  // prettier-ignore
  const verticesTextureCoords = new Float32Array([
    // 顶点坐标，纹理坐标
    0.0, 0.5, 0.5, 0.5,
    -0.5, -0.5, 0.0, 0.0,
    0.5, -0.5, 1.0, 0.0,
  ]);
  // ...

  // 将顶点坐标与纹理坐标写入缓冲区对象
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesTextureCoords, gl.STATIC_DRAW);

  // ...
  // 将纹理坐标分配给aTextureCoord并开启它
  const aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');
  gl.vertexAttribPointer(
    aTextureCoord,
    2,
    gl.FLOAT,
    false,
    FSIZE * 4,
    FSIZE * 2,
  );
  gl.enableVertexAttribArray(aTextureCoord);
}
```

4. 准备待加载纹理图像（initTextures()）

```ts
// 初始化纹理
function initTextures(
  gl: WebGLRenderingContext,
  n: number,
  program: WebGLProgram,
) {
  // 创建纹理对象
  const texture = gl.createTexture();
  if (!texture) {
    throw new Error('Failed to create the texture object');
  }

  // 获取 uSampler 的存储位置
  const uSampler = gl.getUniformLocation(program, 'uSampler');
  if (!uSampler || uSampler < 0) {
    throw new Error('Failed to get the storage location of uSampler');
  }

  const image = new Image();
  // 允许跨域请求
  image.crossOrigin = 'anonymous';
  image.onload = function () {
    // 使用纹理
    loadTexture(gl, n, texture, uSampler, image);
  };
  image.src = 'https://webglfundamentals.org/webgl/resources/f-texture.png';
}
```

5. 监听纹理图像加载事件，等待加载完成后则使用纹理（loadTexture()）

```ts
function loadTexture(
  gl: WebGLRenderingContext,
  n: number,
  texture: WebGLTexture,
  uSampler: WebGLUniformLocation,
  image: HTMLImageElement,
) {
  // 对纹理图像进行y轴反转
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  // 开启0号纹理单元
  gl.activeTexture(gl.TEXTURE0);
  // 向target绑定纹理对象
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // 配置纹理参数
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  // 将纹理图像分配给纹理对象
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // 将0号纹理传递给着色器
  gl.uniform1i(uSampler, 0);
  // 绘制
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}
```

<code src="../demos/triangle/texture.tsx" ></code>

## 拓展

完整展示纹理图像，相当纹理坐标与顶点坐标一一对应。

```ts
// prettier-ignore
const verticesTextureCoords = new Float32Array([
    // 顶点坐标，纹理坐标
    -0.5, 0.5, 0.0, 1.0,
    -0.5, -0.5, 0.0, 0.0,
    0.5, 0.5, 1.0, 1.0,
    0.5, -0.5,1.0, 0.0,
  ]);
```

<code src="../demos/triangle/textureQuad.tsx" ></code>
