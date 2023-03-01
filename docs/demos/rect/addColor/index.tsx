import React from 'react';
import Draw from '../../Draw';
import { initShaderProgram } from '../../utils';
import { drawScene } from './drawScene';
import { initBuffers } from './initBuffers';

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

  // Vertex shader program

  const vsSource = `
    attribute vec4 aVertexPosition;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    varying lowp vec4 vColor;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

  const fsSource = `
  varying lowp vec4 vColor;

  void main() {
    gl_FragColor = vColor;
  }
`;
const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

if (!shaderProgram) throw new Error('initShaderProgram failed');

const programInfo = {
  program: shaderProgram,
  attribLocations: {
    vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
    vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
  },
  uniformLocations: {
    projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
    modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
  },
};
const buffers = initBuffers(gl);

// Draw the scene
drawScene(gl, programInfo, buffers);
}
