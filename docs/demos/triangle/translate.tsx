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
      uniform vec4 uTranslation;
      void main(){
          gl_Position = aVertexPosition+uTranslation;
      }
  `;
  // 片元着色器片段
  const fsSource = `
  void main(){
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
  `;

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  if (!shaderProgram) throw new Error('initShaderProgram failed');

  const n = initVertexBuffer(gl, shaderProgram);
  // 获取uniform变量的存储位置
  const uTranslation = gl.getUniformLocation(shaderProgram, 'uTranslation');
  // 平移量
  const Tx = 0.5;
  const Ty = 0.5;
  const Tz = 0.0;

  // 
  gl.useProgram(shaderProgram);

  // 将平移量传输给顶点着色器
  gl.uniform4f(uTranslation, Tx, Ty, Tz, 0.0);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffer(gl: WebGLRenderingContext, program: WebGLProgram) {
  const vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
  // 顶点个数
  const n = 3;

  // 创建缓冲区对象
  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    alert('Failed to create the buffer object');
    return -1;
  }
  // 将缓冲区对象绑定到目标
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // 向缓冲区对象中写入数据
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // 获取attribute变量的存储位置
  const aPosition = gl.getAttribLocation(program, 'aVertexPosition');
  if (aPosition < 0) {
    alert('Failed to get the storage location of aPosition');
    return -1;
  }
  // 将缓冲区对象分配给aPosition变量
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
  // 连接aPosition变量与分配给它的缓冲区对象
  gl.enableVertexAttribArray(aPosition);

  return n;
}
