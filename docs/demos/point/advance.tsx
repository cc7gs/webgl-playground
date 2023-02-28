import React, { useEffect } from 'react';
import Draw from '../Draw';
import { initShaderProgram } from '../utils';

export default function Advance() {
  return <Draw main={main} />;
}

function main(canvas) {
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
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      pointSize: gl.getAttribLocation(shaderProgram, 'aPointSize'),
    },
    uniformLocations: {
      fragColor: gl.getUniformLocation(shaderProgram, 'uFragColor'),
    },
  };

  canvas.onmousedown = function (ev) {
    canvasClick(ev, gl, canvas, programInfo);
  };

  gl.useProgram(programInfo.program);
  gl.drawArrays(gl.POINTS, 0, 1);
}

const gPoints: number[][] = [];
const gColors: number[][] = [];
function canvasClick(
  ev: MouseEvent,
  gl: WebGLRenderingContext,
  canvas: HTMLCanvasElement,
  programInfo: any,
) {
  let x = ev.clientX;
  let y = ev.clientY;
  const rect = (ev.target as HTMLCanvasElement)?.getBoundingClientRect?.();
  // 将坐标转换为 WebGL 坐标
  x = (x - rect?.left - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect?.top)) / (canvas.height / 2);
  gPoints.push([x, y]);

  /**
   * 鼠标滑入不同象限，点的颜色不同
   * 1. 第一象限：展示红色
   * 2. 第二象限：展示绿色
   * 3. 第三象限：展示蓝色
   */
  if (x >= 0.0 && y >= 0.0) {
    // 第一象限
    gColors.push([1.0, 0.0, 0.0, 1.0]); // red
  } else if (x < 0.0 && y < 0.0) {
    // 第三象限
    gColors.push([0.0, 1.0, 0.0, 1.0]); // green
  } else {
    // 其他象限
    gColors.push([1.0, 1.0, 1.0, 1.0]); // white
  }

  gl.clear(gl.COLOR_BUFFER_BIT);

  const len = gPoints.length;
  for (let i = 0; i < len; i++) {
    const xy = gPoints[i];
    const rbga = gColors[i];
    gl.vertexAttrib3f(
      programInfo.attribLocations.vertexPosition,
      xy[0],
      xy[1],
      0.0,
    );
    gl.vertexAttrib1f(programInfo.attribLocations.pointSize, 10.0);
    gl.uniform4f(
      programInfo.uniformLocations.fragColor,
      rbga[0],
      rbga[1],
      rbga[2],
      rbga[3],
    );
    gl.vertexAttrib1f(
      programInfo.attribLocations.pointSize,
      +parseFloat(Math.random() * 10 + '').toFixed(1),
    );
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}
