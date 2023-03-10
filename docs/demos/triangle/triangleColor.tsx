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
      varying lowp vec4 vColor;
      void main(){
          gl_Position = aVertexPosition;
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
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffer(gl: WebGLRenderingContext, program: WebGLProgram) {
  const verticesColors = new Float32Array([
    0.0, 0.5, 1.0, 0.0, 0.0, 1.0, -0.5, -0.5, 0.0, 1.0, 0.0, 1.0, 0.5, -0.5,
    0.0, 0.0, 1.0, 1.0,
  ]);
  // 顶点个数
  const n = 3;

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
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, FSIZE * 6, 0);
  // 连接aPosition变量与分配给它的缓冲区对象
  gl.enableVertexAttribArray(aPosition);

  const aColor = gl.getAttribLocation(program, 'aVertexColor');
  gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, FSIZE * 6, FSIZE * 2);
  gl.enableVertexAttribArray(aColor);

  return n;
}
