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

  // 顶点着色器片段
  const vsSource = `
      attribute vec4 aVertexPosition;
      attribute vec2 aTextureCoord;
      varying  vec2 vTextureCoord;

      void main(){
          gl_Position = aVertexPosition;
         vTextureCoord = aTextureCoord;
      }
  `;
  // 片元着色器片段
  const fsSource = `
    uniform sampler2D uSampler;
    varying mediump vec2 vTextureCoord;
    void main(){
      gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
  `;

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  if (!shaderProgram) throw new Error('initShaderProgram failed');
  const n = initVertexBuffer(gl, shaderProgram);
  // 配置纹理
  initTextures(gl, n, shaderProgram);
}

function initVertexBuffer(gl: WebGLRenderingContext, program: WebGLProgram) {
  // prettier-ignore
  const verticesTextureCoords = new Float32Array([
    // 顶点坐标，纹理坐标
    -0.5, 0.5, 0.0, 1.0,
    -0.5, -0.5, 0.0, 0.0,
    0.5, 0.5, 1.0, 1.0,
    0.5, -0.5,1.0, 0.0,
  ]);
  // 顶点个数
  const n = 4;

  // 创建缓冲区对象
  const vertexTextureCoordBuffer = gl.createBuffer();
  if (!vertexTextureCoordBuffer) {
    alert('Failed to create the buffer object');
    return -1;
  }

  // 将顶点坐标与纹理坐标写入缓冲区对象
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesTextureCoords, gl.STATIC_DRAW);

  const FSIZE = verticesTextureCoords.BYTES_PER_ELEMENT;

  // 获取attribute变量的存储位置
  const aPosition = gl.getAttribLocation(program, 'aVertexPosition');
  // 将缓冲区对象分配给aPosition变量
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, FSIZE * 4, 0);
  // 连接aPosition变量与分配给它的缓冲区对象
  gl.enableVertexAttribArray(aPosition);

  const aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');
  gl.vertexAttribPointer(
    aTextureCoord,
    2,
    gl.FLOAT,
    false,
    FSIZE * 4,
    FSIZE * 2,
  );
  gl.enableVertexAttribArray(aTextureCoord);

  return n;
}

// 初始化纹理
function initTextures(
  gl: WebGLRenderingContext,
  n: number,
  program: WebGLProgram,
) {
  // 创建纹理对象
  const texture = gl.createTexture();
  if (!texture) {
    throw new Error('Failed to create the texture object');
  }

  // 获取 uSampler 的存储位置
  const uSampler = gl.getUniformLocation(program, 'uSampler');
  if (!uSampler || uSampler < 0) {
    throw new Error('Failed to get the storage location of uSampler');
  }

  const image = new Image();
  // 允许跨域请求
  image.crossOrigin = 'anonymous';
  image.onload = function () {
    // 使用纹理
    loadTexture(gl, n, texture, uSampler, image);
  };
  image.src = 'https://webglfundamentals.org/webgl/resources/f-texture.png';
}

// 使用纹理
function loadTexture(
  gl: WebGLRenderingContext,
  n: number,
  texture: WebGLTexture,
  uSampler: WebGLUniformLocation,
  image: HTMLImageElement,
) {
  // 对纹理图像进行y轴反转
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  // 开启0号纹理单元
  gl.activeTexture(gl.TEXTURE0);
  // 向target绑定纹理对象
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // 配置纹理参数
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  // 将纹理图像分配给纹理对象
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // 将0号纹理传递给着色器
  gl.uniform1i(uSampler, 0);

  // 绘制矩形
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}
