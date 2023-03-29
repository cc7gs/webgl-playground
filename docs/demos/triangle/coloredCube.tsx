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

// prettier-ignore
function initVertexBuffer(gl: WebGLRenderingContext, program: WebGLProgram) {
  const vertices = new Float32Array([
    // 前面
    -1, -1,  1,
     1, -1,  1,
     1,  1,  1,
    -1,  1,  1,
  
    // 右面
     1, -1,  1,
     1, -1, -1,
     1,  1, -1,
     1,  1,  1,
  
    // 后面
     1, -1, -1,
    -1, -1, -1,
    -1,  1, -1,
     1,  1, -1,
  
    // 左面
    -1, -1, -1,
    -1, -1,  1,
    -1,  1,  1,
    -1,  1, -1,
  
    // 顶面
    -1,  1,  1,
     1,  1,  1,
     1,  1, -1,
    -1,  1, -1,
  
    // 底面
    -1, -1, -1,
     1, -1, -1,
     1, -1,  1,
    -1, -1,  1,
  ]);
  

  const colors=new Float32Array([
    // 前面 - 红色
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
  
    // 右面 - 绿色
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
  
    // 后面 - 蓝色
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
  
    // 左面 - 黄色
    1, 1, 0,
    1, 1, 0,
    1, 1, 0,
    1, 1, 0,
  
    // 顶面 - 青色
    0, 1, 1,
    0, 1, 1,
    0, 1, 1,
    0, 1, 1,
  
    // 底面 - 品红
    1, 0, 1,
    1, 0, 1,
    1, 0, 1,
    1, 0, 1,
  ])

  // 顶点索引
  const indices = new Uint8Array([
    // 前面
    0, 1, 2,
    2, 3, 0,
  
    // 右面
    4, 5, 6,
    6, 7, 4,
  
    // 后面
    8, 9, 10,
    10, 11, 8,
  
    // 左面
    12, 13, 14,
    14, 15, 12,
  
    // 顶面
    16, 17, 18,
    18, 19, 16,
  
    // 底面
    20, 21, 22,
    22, 23, 20,
  ]);
  

  // 创建缓冲区对象
  const indexBuffer = gl.createBuffer();


  if(!initArrayBuffer(gl,program,vertices,3,gl.FLOAT,'aVertexPosition')){
    alert('vertices failed to initArrayBuffer');
    return -1;
  }
  if(!initArrayBuffer(gl,program,colors,3,gl.FLOAT,'aVertexColor')){
    alert('colors failed to initArrayBuffer');
    return -1;
  }

  // 将顶点索引数据写入缓冲区对象
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  return indices.length;
}

function initArrayBuffer(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  data: any,
  num: number,
  type: number,
  attribute: string,
) {
  const buffer = gl.createBuffer();
  if (!buffer) {
    alert('Failed to create the buffer object');
    return false;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  const aAttribute = gl.getAttribLocation(program, attribute);
  gl.vertexAttribPointer(aAttribute, num, type, false, 0, 0);
  gl.enableVertexAttribArray(aAttribute);
  return true;
}
