import initDraw from "@/draw";
import { useEffect, useRef } from "react";

export default function Canvas({roomId, socket}: {
  roomId: string,
  socket: WebSocket
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      initDraw(canvasRef.current, roomId, socket);
    }
  }, [canvasRef, roomId]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="block touch-none" // 'block' removes default inline spacing
      />
      <div className="absolute bottom-0 right-0 m-6 p-2 border rounded">
        <div className="text-gray-300 bg-gray-500 rounded px-1 mb-1">Rect</div>
        <div className="text-gray-300 bg-gray-500 rounded px-1 mt-1">Circle</div>
      </div>
    </>
  );
}
