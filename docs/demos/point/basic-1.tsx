
import Draw from '../Draw';
import { initShaderProgram } from '../utils';

export default function BasicOne() {
  return <Draw main={main} />;
}

function main(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl');
  if (!gl) {
    alert('无法初始化 WebGL，你的浏览器、操作系统或硬件等可能不支持 WebGL。');
    return;
  }

  // 清空画布
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // 清空颜色缓冲区
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 顶点着色器片段
  const vsSource = `
      void main(){
          gl_Position = vec4(0.0, 0.5, 0.0, 1.0);
          gl_PointSize = 10.0;
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
  gl.drawArrays(gl.POINTS, 0, 1);
}
