import { useEffect } from 'react';

export default function CanvasScene({ canvasRef, position, style }) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Glow effect
    ctx.shadowColor = style.glow || 'transparent';
    ctx.shadowBlur = style.glow ? 20 : 0;

    // Draw object
    ctx.fillStyle = '#007acc';
    ctx.fillRect(position.x, position.y, 40, 40);
  }, [position, style, canvasRef]);

  return (
    <canvas
      id="motion-canvas"
      ref={canvasRef}
      width={400}
      height={300}
      style={{
        border: '1px solid #ccc',
        background: '#f9f9f9',
        margin: '16px 0'
      }}
    />
  );
}
