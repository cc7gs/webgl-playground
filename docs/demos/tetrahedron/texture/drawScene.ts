import { mat4 } from 'gl-matrix';
import { IBuffers } from './initBuffers';

interface IProgramInfo {
  program: WebGLProgram;
  attribLocations: Record<string, number>;
  uniformLocations: Record<string, WebGLUniformLocation | null>;
}

export function drawScene(
  gl: WebGLRenderingContext,
  programInfo: IProgramInfo,
  buffers: IBuffers,
  texture: WebGLTexture,
  cubeRotation: number,
) {
  // 清空画布
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  
  // 开启隐藏面消除
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  
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

  // 绑定顶点缓冲区对象
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    3,
    gl.FLOAT,
    false,
    0,
    0,
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);


  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
  gl.vertexAttribPointer(
    programInfo.attribLocations.textureCoord,
    2,
    gl.FLOAT,
    false,
    0,
    0,
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);



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

   // Tell WebGL we want to affect texture unit 0
   gl.activeTexture(gl.TEXTURE0);

   // Bind the texture to texture unit 0
   gl.bindTexture(gl.TEXTURE_2D, texture);

   // Tell the shader we bound the texture to texture unit 0
   gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

  gl.drawElements(gl.TRIANGLES, buffers.numVertices, gl.UNSIGNED_BYTE, 0);
}
