import { loadTexture } from '../../rect/lighting/loadTexture';
import Draw from '../../Draw';
import { initShaderProgram } from '../../utils';
import { drawScene } from './drawScene';

export default function Basic() {
  return <Draw main={main} />;
}

let cubeRotation = 0.0;
let deltaTime = 0;
let copyVideo = false;

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
      attribute vec2 aTextureCoord;

      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;

      varying highp vec2 vTextureCoord;
      
      void main(){
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vTextureCoord = aTextureCoord;
      }
  `;
  // 片元着色器片段
  const fsSource = `
  varying highp vec2 vTextureCoord;
  
  uniform sampler2D uSampler;

  void main(){
    gl_FragColor =  texture2D(uSampler, vTextureCoord);
  }
  `;

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  if (!shaderProgram) throw new Error('initShaderProgram failed');

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      aTextureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
      // textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        'uProjectionMatrix',
      ),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  // Load texture
  const texture = loadTexture(
    gl,
    'https://mdn.github.io/dom-examples/webgl-examples/tutorial/sample6/cubetexture.png',
  );
  // Flip image pixels into the bottom-to-top order that WebGL expects.
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  let then = 0;

  function render(now: number) {
    now *= 0.001;
    deltaTime = now - then;
    then = now;
    drawScene(gl!, programInfo, texture!, cubeRotation);
    cubeRotation += deltaTime;
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
