import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { ArrowRight, Circle, Eraser, LineSquiggle, Square, Text } from "lucide-react";
import { Game } from "@/draw/Game";

export type Tool = "circle" | "rect" | "pencil" | "arrow" | "text" | "eraser";

export default function Canvas({ roomId, socket }: { roomId: string; socket: WebSocket }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>("circle");
  const [game, setGame] = useState<Game>();

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

  return (
    <>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="block touch-none" // 'block' removes default inline spacing
      />
      <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
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
