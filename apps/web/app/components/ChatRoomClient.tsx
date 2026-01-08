"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { routeModule } from "next/dist/build/templates/pages";

export function ChatRoomClient({ messages, id }: { messages: { message: string }[]; id: string }) {
  const { socket, loading } = useSocket();
  const [currentMessage, setCurrentMessage] = useState("");
  const [chats, setChats] = useState(messages);

  useEffect(() => {
    if (socket && !loading && socket.readyState === WebSocket.OPEN) {
        alert("joied room")
      socket.send(
        JSON.stringify({
          type: "join_room",
          roomId: id
        })
      );
      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.type === "chat") {
          setChats((c) => [...c, { message: parsedData.message }]);
        }
      };
    }
    return () => {
        socket?.close()
    }
  }, [socket, loading, id]);

  return (
    <div>
      {chats.map((m) => (
        <div>{m.message}</div>
      ))}

      <input
        type="text"
        value={currentMessage}
        onChange={(e) => {
          setCurrentMessage(e.target.value);
        }}
      />

      <button
        onClick={() => {
          socket?.send(
            JSON.stringify({
              type: "chat",
              roomId: id,
              message: currentMessage,
            })
          );
          setCurrentMessage("");
        }}
      >
        Send
      </button>
    </div>
  );
}
