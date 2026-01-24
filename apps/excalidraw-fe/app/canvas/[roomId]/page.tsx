"use client";
import initDraw from "@/draw";
import { useEffect, useRef } from "react";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      initDraw(canvasRef.current);
    }
  }, [canvasRef]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#121212]">
      <canvas
        ref={canvasRef}
        className="block touch-none" // 'block' removes default inline spacing
      />
    </div>
  );
}
