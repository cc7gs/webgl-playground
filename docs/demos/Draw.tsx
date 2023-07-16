import { useEffect, useRef } from 'react';

export default function Draw({ main }: { main: Function }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // 此处 canvasRef.current 等价 document.querySelector('#glcanvas') 方式获取
    main(canvasRef.current);
  }, []);

  return <canvas ref={canvasRef} width="600" height="600"></canvas>;
}
