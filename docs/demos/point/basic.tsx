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

  const vsSource = `
     attribute vec4 aVertexPosition;
     attribute float aPointSize;

      void main(){
          gl_Position = aVertexPosition;
          gl_PointSize = aPointSize;
      }
  `;

  const fsSource = `
  precision mediump float;
  uniform vec4 uFragColor;
  void main(){
      gl_FragColor = uFragColor;
  }
  `;

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  if (!shaderProgram) throw new Error('initShaderProgram failed');

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      // 获取 attribute 变量的存储位置
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      pointSize: gl.getAttribLocation(shaderProgram, 'aPointSize'),
    },
    uniformLocations: {
      fragColor: gl.getUniformLocation(shaderProgram, 'uFragColor'),
    },
  };

  gl.vertexAttrib3f(programInfo.attribLocations.vertexPosition, 0.0, 0.5, 1.0);
  gl.vertexAttrib1f(programInfo.attribLocations.pointSize, 10.0);
  gl.uniform4f(programInfo.uniformLocations.fragColor, 1.0, 0.0, 0.0, 1.0);
  /**
   *  与上面 vertexAttrib3f 等价
   *   const position=new Float32Array([0,0.5,1.0,1.0]);
   *   gl.vertexAttrib4fv(programInfo.attribLocations.vertexPosition, position);
   */

  gl.useProgram(programInfo.program);
  gl.drawArrays(gl.POINTS, 0, 1);
}
