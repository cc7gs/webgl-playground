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
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 顶点着色器片段
  const vsSource = `
      attribute vec4 aVertexPosition;
      attribute vec4 aVertexColor;
      uniform mat4 uViewMatrix;
      uniform mat4 uPerspectiveMatrix;
      varying  vec4 vColor;
      void main(){
          gl_Position = uPerspectiveMatrix * uViewMatrix * aVertexPosition;
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
  // 获取uniform变量的存储位置
  const uViewMatrix = gl.getUniformLocation(
    shaderProgram,
    'uViewMatrix',
  );
  const uPerspectiveMatrix = gl.getUniformLocation(shaderProgram, 'uPerspectiveMatrix');

  // 视图矩阵
  const viewMatrix = mat4.create();
  // 透视投影矩阵
  const perspectiveMatrix = mat4.create();

  // 计算透视投影矩阵
  mat4.lookAt(viewMatrix, [0, 0, 5], [0, 0, -100], [0, 1, 0]);
  mat4.perspective(perspectiveMatrix, Math.PI / 6, canvas.width / canvas.height, 1, 100);

  // 将视图矩阵传输给顶点着色器
  gl.uniformMatrix4fv(uViewMatrix, false, viewMatrix);
  // 将透视投影矩阵传输给顶点着色器
  gl.uniformMatrix4fv(uPerspectiveMatrix, false, perspectiveMatrix);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffer(gl: WebGLRenderingContext, program: WebGLProgram) {
  // prettier-ignore
  const verticesColors = new Float32Array([
    // 右侧三个三角形 
    0.75, 1.0, -4.0, 0.4, 1.0, 0.4,1.0, // 绿色三角形在最后面
    0.25, -1.0, -4.0, 0.4, 1.0, 0.4,1.0,
    1.25, -1.0, -4.0, 0.4,1.0,0.4,1.0,
    // 黄色三角形在中间
    0.75, 1.0, -2.0, 1.0, 0.4, 0.4,1.0,
    0.25, -1.0, -2.0, 1.0, 0.4, 0.4,1.0,
    1.25, -1.0, -2.0, 1.0, 0.4, 0.4,1.0,
    // 蓝色三角形在最前面
    0.75, 1.0, 0.0, 0.4, 0.4, 1.0,1.0,
    0.25, -1.0, 0.0, 0.4, 0.4, 1.0,1.0,
    1.25, -1.0, 0.0,  0.4, 0.4,1.0,1.0,

    // 左侧三个三角形
    -0.75, 1.0, -4.0, 0.4, 1.0, 0.4,1.0, // 绿色三角形在最后面
    -1.25, -1.0, -4.0, 0.4, 1.0, 0.4,1.0,
    -0.25, -1.0, -4.0, 0.4,1.0,0.4,1.0,
    // 黄色三角形在中间
    -0.75, 1.0, -2.0, 1.0, 0.4, 0.4,1.0,
    -1.25, -1.0, -2.0, 1.0, 0.4, 0.4,1.0,
    -0.25, -1.0, -2.0, 1.0, 0.4, 0.4,1.0,
    // 蓝色三角形在最前面
    -0.75, 1.0, 0.0, 0.4, 0.4, 1.0,1.0,
    -1.25, -1.0, 0.0, 0.4, 0.4, 1.0,1.0,
    -0.25, -1.0, 0.0,  0.4, 0.4,1.0,1.0,
  ]);
  // 顶点个数
  const n = 18; // 共6个三角形，每个三角形3个顶点

  // 创建缓冲区对象
  const vertexColorBuffer = gl.createBuffer();
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

  return n;
}
