export function initBuffers(gl: WebGLRenderingContext) {
  const positionBuffer = initPositionBuffer(gl);

  const textureCoordBuffer = initTextureBuffer(gl);

  const indexData = initIndexBuffer(gl);

  return {
    position: positionBuffer,
    indices: indexData.buffer,
    numVertices: indexData.numVertices,
    textureCoord: textureCoordBuffer,
  };
}

export type IBuffers = ReturnType<typeof initBuffers>;

function initPositionBuffer(gl: WebGLRenderingContext) {
  // Create a buffer for the square's positions.
  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const vertices = [
    0.0, 1.0, 0.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 0.0, -1.0, -1.0,
  ];
  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  return positionBuffer;
}

function initIndexBuffer(gl: WebGLRenderingContext) {
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  // 索引缓冲区
  const indices = [0, 1, 2, 0, 2, 3, 0, 3, 1, 1, 3, 2];
  // Now send the element array to GL

  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint8Array(indices),
    gl.STATIC_DRAW,
  );

  return {
    numVertices: indices.length,
    buffer: indexBuffer,
  };
}

function initTextureBuffer(gl: WebGLRenderingContext) {
  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

  const textureCoordinates = [
    // Front face
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Back face
    1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,
    // Top face
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    // Bottom face
    1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
  ];

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(textureCoordinates),
    gl.STATIC_DRAW,
  );

  return textureCoordBuffer;
}
