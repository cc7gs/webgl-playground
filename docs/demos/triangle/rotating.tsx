import { mat4 } from 'gl-matrix';
import Draw from '../Draw';
import { initShaderProgram } from '../utils';

export default function Basic() {
  return <Draw main={main} />;
}

const ANGLE_STEP = 30.0;

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
      uniform mat4 uModelFormMatrix; 
      void main(){
         gl_Position = uModelFormMatrix * aVertexPosition;
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

  // programInfo 用于存储着色器程序相关信息
  const programInfo = {
    program: shaderProgram,
    uniformLocations: {
      uModelFormMatrix: gl.getUniformLocation(
        shaderProgram,
        'uModelFormMatrix',
      ),
    },
  };

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

let g_last = Date.now();
function animate(angle: number) {
  const now = Date.now();
  // 计算距离上次调用经过多长时间
  const elapsed = now - g_last;
  g_last = now;
  // 更新旋转角度
  const newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle % 360;
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
