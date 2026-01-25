"use client"

import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import Canvas from "./Canvas";

export default function RoomCanvas({roomId}: {roomId: string}) {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkMTk3YmFhZC1iYzEwLTRhMDctYTlhYi01OTQzNTA0OGVhYjYiLCJpYXQiOjE3NjkzMzA1MDd9.-yGLDCini5Q5g4cpeILZk5nHE4njiS4fZBB-JtJzP64`);

        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
              type: "join_room",
              roomId
            }))
        }
    }, [])

    

  if(!socket) {
    return <div>Connecting to server...</div>
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#121212]">
      <Canvas roomId={roomId} socket={socket} />
    </div>
  );
}