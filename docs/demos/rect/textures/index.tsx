import Draw from '../../Draw';
import { initShaderProgram } from '../../utils';
import { drawScene } from './drawScene';
import { initBuffers } from './initBuffers';
import { loadTexture } from './loadTexture';

export default function Basic() {
  return <Draw main={main} />;
}

let cubeRotation = 0.0;
let deltaTime = 0;

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
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
    }
  `;

  const fsSource = `
  varying highp vec2 vTextureCoord;

  uniform sampler2D uSampler;

  void main() {
    gl_FragColor = texture2D(uSampler, vTextureCoord);
  }
`;
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  if (!shaderProgram) throw new Error('initShaderProgram failed');

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        'uProjectionMatrix',
      ),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };
  const buffers = initBuffers(gl);

  // Load texture
  const texture = loadTexture(gl, 'https://mdn.github.io/dom-examples/webgl-examples/tutorial/sample6/cubetexture.png');
  // Flip image pixels into the bottom-to-top order that WebGL expects.
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  let then = 0;

  function render(now: number) {
    now *= 0.001;
    deltaTime = now - then;
    then = now;

    // Draw the scene
    drawScene(gl!, programInfo, buffers,texture!, cubeRotation);
    cubeRotation += deltaTime;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
