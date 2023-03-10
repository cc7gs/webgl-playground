import React, { useEffect, useRef } from 'react';

export default function Draw({ main }: { main: Function }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // 此处 canvasRef.current 等价 document.querySelector('#glcanvas') 方式获取
    main(canvasRef.current);
  }, []);

  return (
    <canvas ref={canvasRef} id="glcanvas" width="400" height="400"></canvas>
  );
}
