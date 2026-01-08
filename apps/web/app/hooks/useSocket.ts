import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0MzYwOGVkOC1mNDgyLTQzMjMtYjg3Yy0yMDIzNGJjYTgxZjAiLCJpYXQiOjE3Njc3OTMwODF9.jGrahlynfuhBidra3aQGDvE5BBsUN2NHblwyAT9RtWc`);
    ws.onopen = () => {
      setSocket(ws);
      setLoading(false);
    };
  }, []);

  return {
    socket,
    loading,
  };
}
