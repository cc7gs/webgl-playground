import { mat4, vec3 } from 'gl-matrix';
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
      attribute vec4 aVertexColor;
      attribute vec3 aVertexNormal; // 法向量

      uniform mat4 uNormalMatrix;
      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;

      uniform vec3 uLightDirection; // 光线方向
      uniform vec3 uLightColor; // 光线颜色
      uniform vec3 uAmbientLight; // 环境光颜色
      
      varying highp vec4 vColor;

      void main(){
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
        highp vec3 directionalLightColor = vec3(1, 1, 1);
        highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
  
        highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
  
        highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
        highp vec3 vLighting = ambientLight + (directionalLightColor * directional);
        vColor=vec4(aVertexColor.rgb*vLighting,1.0);
      }
  `;
  // 片元着色器片段
  const fsSource = `
  varying highp vec4 vColor;

  void main(){
    gl_FragColor = vColor;
  }
  `;

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  if (!shaderProgram) throw new Error('initShaderProgram failed');

  const uAmbientLight = gl.getUniformLocation(shaderProgram, 'uAmbientLight');
  const uLightColor = gl.getUniformLocation(shaderProgram, 'uLightColor');
  const uLightDirection = gl.getUniformLocation(shaderProgram, 'uLightDirection');

  // 设置环境光颜色
  gl.uniform3f(uAmbientLight, 0.3, 0.3, 0.3);
  // 设置光线颜色（白色）
  gl.uniform3f(uLightColor, 1.0, 1.0, 1.0);
  // 设置光线方向（世界坐标系下）
  const lightDirection = vec3.fromValues(0.3, 3.0, 4.0);
  vec3.normalize(lightDirection, lightDirection);
  gl.uniform3fv(uLightDirection,  lightDirection);




  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
      // textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
      aVertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        'uProjectionMatrix',
      ),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
    },
  };

  let then = 0;

  function render(now: number) {
    now *= 0.001;
    deltaTime = now - then;
    then = now;
    drawScene(gl!, programInfo, cubeRotation);
    cubeRotation += deltaTime;
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
