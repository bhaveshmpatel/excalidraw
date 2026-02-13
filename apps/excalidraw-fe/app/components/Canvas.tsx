import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { ArrowRight, Circle, Eraser, LineSquiggle, Square, Text, Minus, Plus } from "lucide-react";
import { Game } from "@/draw/Game";

export type Tool = "circle" | "rect" | "pencil" | "arrow" | "text" | "eraser";

export default function Canvas({ roomId, socket }: { roomId: string; socket: WebSocket }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>("circle");
  const [game, setGame] = useState<Game>();
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  useEffect(() => {
    if (canvasRef.current) {
      const g = new Game(canvasRef.current, roomId, socket);
      setGame(g);

      return () => {
        g.destroy();
      };
    }
  }, [canvasRef]);

  const handleZoom = (newZoom: number) => {
    setZoom(newZoom);
    game?.setZoom(newZoom);
  };

  return (
    <>
      <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} className="block touch-none" />
      <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
      <div className="fixed bottom-4 left-4 flex gap-2">
        <button className="p-2 bg-[#232329] rounded-lg hover:bg-zinc-700 text-white transition-colors" onClick={() => handleZoom(Math.max(0.1, zoom - 0.1))}>
          <Minus size={20} />
        </button>
        <span className="p-2 bg-[#232329] rounded-lg text-white min-w-[60px] text-center">{Math.round(zoom * 100)}%</span>
        <button className="p-2 bg-[#232329] rounded-lg hover:bg-zinc-700 text-white transition-colors" onClick={() => handleZoom(zoom + 0.1)}>
          <Plus size={20} />
        </button>
      </div>
    </>
  );
}

function Topbar({ selectedTool, setSelectedTool }: { selectedTool: Tool; setSelectedTool: (s: Tool) => void }) {
  return (
    <div className="absolute flex top-0 inset-x-0 mx-auto w-min p-1 gap-1 mt-4 bg-[#232329] rounded-lg">
      <IconButton
        icon={<ArrowRight size={15} strokeWidth={2} />}
        onClick={() => {
          setSelectedTool("arrow");
        }}
        isActivated={selectedTool === "arrow"}
      />
      <IconButton
        icon={<Square size={15} strokeWidth={2} />}
        onClick={() => {
          setSelectedTool("rect");
        }}
        isActivated={selectedTool === "rect"}
      />
      <IconButton
        icon={<Circle size={15} strokeWidth={2} />}
        onClick={() => {
          setSelectedTool("circle");
        }}
        isActivated={selectedTool === "circle"}
      />
      <IconButton
        icon={<Text size={15} strokeWidth={2} />}
        onClick={() => {
          setSelectedTool("text");
        }}
        isActivated={selectedTool === "text"}
      />
      <IconButton
        icon={<LineSquiggle size={15} strokeWidth={2} />}
        onClick={() => {
          setSelectedTool("pencil");
        }}
        isActivated={selectedTool === "pencil"}
      />
      <IconButton
        icon={<Eraser size={15} strokeWidth={2} />}
        onClick={() => {
          setSelectedTool("eraser");
        }}
        isActivated={selectedTool === "eraser"}
      />
    </div>
  );
}
