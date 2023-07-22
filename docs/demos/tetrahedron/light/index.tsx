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
      attribute vec3 aVertexColor;
      attribute vec4 aVertexNormal; // 法向量

      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;

      uniform vec3 uLightDirection; // 光线方向

      varying lowp vec3 vColor;
      varying highp vec3 vLighting; 
      
      void main(){
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;

        highp vec3 ambientLight = vec3(0.3, 3.0, 4.0);
        highp vec3 uLightColor = vec3(1, 1, 1);

        vec3 normal = normalize(vec3(aVertexNormal));
          // 计算光线方向和法向量的点积
          float nDotL = max(dot(uLightDirection, normal), 0.0);
          // 计算漫反射光的颜色
          vec3 diffuse = uLightColor * aVertexColor.rgb * nDotL;
          vColor = vec4(diffuse, aVertexColor.a);
      }
  `;
  // 片元着色器片段
  const fsSource = `
  varying lowp vec3 vColor;

  void main(){
    gl_FragColor = vec4(vColor, 1.0);
  }
  `;

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  if (!shaderProgram) throw new Error('initShaderProgram failed');


  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
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
