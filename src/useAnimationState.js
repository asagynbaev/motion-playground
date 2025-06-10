import { useRef, useState } from 'react';

export function useAnimationState() {
  const canvasRef = useRef(null);
  const [position, setPosition] = useState({ x: 180, y: 130 });
  const [style, setStyle] = useState({ glow: null });

  return {
    canvasRef,
    position,
    setPosition,
    style,
    setStyle
  };
}
