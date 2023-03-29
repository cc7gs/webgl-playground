import { mat4 } from 'gl-matrix';
import Draw from '../Draw';
import { initShaderProgram } from '../utils';

export default function Basic() {
  return <Draw main={main} />;
}

function main(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl');
  if (!gl) {
    alert('无法初始化 WebGL，你的浏览器、操作系统或硬件等可能不支持 WebGL。');
    return;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // 开启隐藏面消除
  gl.enable(gl.DEPTH_TEST);
  // 清除颜色缓冲区和深度缓冲区
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // 顶点着色器片段
  const vsSource = `
      attribute vec4 aVertexPosition;
      attribute vec4 aVertexColor;
      uniform mat4 uMvpMatrix;
    
      varying  vec4 vColor;
      void main(){
          gl_Position = uMvpMatrix * aVertexPosition;
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

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  if (!shaderProgram) throw new Error('initShaderProgram failed');
  const n = initVertexBuffer(gl, shaderProgram);

  // 获取 uniform 变量的存储位置
  const uMvpMatrix = gl.getUniformLocation(shaderProgram, 'uMvpMatrix');

  // 设置视点、可视空间
  const mvpMatrix = mat4.create();
  const perspectiveMatrix = mat4.create();
  const viewMatrix = mat4.create();
  mat4.perspective(perspectiveMatrix, Math.PI / 6, 1, 1, 100);
  mat4.lookAt(viewMatrix, [3, 3, 7], [0, 0, 0], [0, 1, 0]);
  mat4.multiply(mvpMatrix, perspectiveMatrix, viewMatrix);
  gl.uniformMatrix4fv(uMvpMatrix, false, mvpMatrix);

  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffer(gl: WebGLRenderingContext, program: WebGLProgram) {
  // prettier-ignore
  const verticesColors = new Float32Array([
    // 顶点坐标和颜色
    1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, // v0 白色
    -1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, // v1 红色
    -1.0, -1.0, 1.0, 1.0, 0.0, 1.0, 0.0, // v2 绿色
    1.0, -1.0, 1.0, 1.0, 0.0, 1.0, 1.0, // v3 蓝色
    1.0, -1.0, -1.0, 1.0, 1.0, 0.0, 0.0, // v4 黄色
    1.0, 1.0, -1.0, 1.0, 1.0, 0.0, 1.0, // v5 品红
    -1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 0.0, // v6 青色
    -1.0, -1.0, -1.0, 1.0, 0.0, 0.0, 0.0, // v7 黑色
  ]);

  // prettier-ignore
  // 顶点索引
  const indices = new Uint8Array([
    0,1,2,0,2,3, // 前
    0,3,4,0,4,5, // 右
    0,5,6,0,6,1, // 上
    1,6,7,1,7,2, // 左
    7,4,3,7,3,2, // 下
    4,7,6,4,6,5, // 后
  ]);

  // 创建缓冲区对象
  const vertexColorBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();

  if (!vertexColorBuffer) {
    alert('Failed to create the buffer object');
    return -1;
  }

  // 将缓冲区对象绑定到目标
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  // 向缓冲区对象中写入数据
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  const FSIZE = verticesColors.BYTES_PER_ELEMENT;

  // 获取attribute变量的存储位置
  const aPosition = gl.getAttribLocation(program, 'aVertexPosition');
  // 将缓冲区对象分配给aPosition变量
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, FSIZE * 7, 0);
  // 连接aPosition变量与分配给它的缓冲区对象
  gl.enableVertexAttribArray(aPosition);

  const aColor = gl.getAttribLocation(program, 'aVertexColor');
  gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, FSIZE * 7, FSIZE * 3);
  gl.enableVertexAttribArray(aColor);

  // 将顶点索引数据写入缓冲区对象
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  return indices.length;
}
