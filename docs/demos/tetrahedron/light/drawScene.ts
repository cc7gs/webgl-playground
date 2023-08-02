import { mat4 } from 'gl-matrix';

interface IProgramInfo {
  program: WebGLProgram;
  attribLocations: Record<string, number>;
  uniformLocations: Record<string, WebGLUniformLocation | null>;
}

export function drawScene(
  gl: WebGLRenderingContext,
  programInfo: IProgramInfo,
  cubeRotation: number,
) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  // Clear the canvas before we start drawing on it.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fieldOfView = (45 * Math.PI) / 180; // in radians
  const canvas = gl.canvas as HTMLCanvasElement;

  const aspect = canvas.clientWidth / canvas.clientHeight || 1;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  // amount to translate
  mat4.translate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to translate
    [-0.0, 0.0, -6.0],
  );

  // axis to rotate around (Z)
  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    cubeRotation, // amount to rotate in radians
    [0, 0, 1],
  );

  // axis to rotate around (X)
  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    cubeRotation * 0.7, // amount to rotate in radians
    [0, 1, 0],
  );

  // axis to rotate around (Y)
  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    cubeRotation * 0.7, // amount to rotate in radians
    [1, 0, 0],
  );

  const normalMatrix = mat4.create();
  mat4.invert(normalMatrix, modelViewMatrix);
  mat4.transpose(normalMatrix, normalMatrix);

  // 初始化顶点缓冲区
  initVertexBuffer(gl, programInfo);

  // Set the shader uniforms
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix,
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix,
  );

  gl.drawElements(gl.TRIANGLES, 12, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffer(
  gl: WebGLRenderingContext,
  programInfo: IProgramInfo,
) {
  // 顶点缓冲区
  var vertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  var vertices = [
    0.0, 1.0, -0.5, -1.0, -0.5, -0.5, 1.0, -0.5, -0.5, 0.0, 0.0, 1.0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    3,
    gl.FLOAT,
    false,
    0,
    0,
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

  // 索引缓冲区
  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  var indices = [0, 1, 2, 0, 2, 3, 0, 3, 1, 2, 1, 3];
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint8Array(indices),
    gl.STATIC_DRAW,
  );

  // 颜色缓冲区
  var vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  var colors = [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexColor,
    3,
    gl.FLOAT,
    false,
    0,
    0,
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);

  // 法线缓冲区
  var vertexNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
  var vertexNormals = [
    0.0, 0.0, 1.0, -1, -1.0, 0.0, 1.0, -1.0, 0.0, 0.0, 0.0, -1.0,
  ];
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(vertexNormals),
    gl.STATIC_DRAW,
  );
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexNormal,
    3,
    gl.FLOAT,
    false,
    0,
    0,
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
}
