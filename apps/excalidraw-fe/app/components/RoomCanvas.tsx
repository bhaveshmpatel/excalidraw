"use client";

import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import Canvas from "./Canvas";

export default function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/signin";
      return;
    }
    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        }),
      );
    };
  }, []);

  if (!socket) {
    return <div>Connecting to server...</div>;
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#121212]">
      <Canvas roomId={roomId} socket={socket} />
    </div>
  );
}
