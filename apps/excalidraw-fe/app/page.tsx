"use client";

import Link from "next/link";
import { ArrowRight, Pencil, Share2, Layers, Github } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HTTP_BACKEND } from "@/config";
import axios from "axios";

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);

  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    setAuthToken(localStorage.getItem("token"));
  }, []);

  const createRoom = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${HTTP_BACKEND}/room`,
        {
          name: roomName,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        },
      );

      router.push(`/canvas/${response.data.roomId}`);
    } catch (e) {
      alert("Error creating room");
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = () => {
    if (roomId) {
      router.push(`/canvas/${roomId}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-purple-500/30">
      {/* Header */}
      <header className="fixed top-0 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">E</span>
            </div>
            <span className="font-bold text-xl tracking-tight">Excalidraw</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="#features" className="hover:text-white transition-colors">
              Features
            </Link>
            <Link href="https://github.com/bhaveshmpatel/excalidraw" target="_blank" className="hover:text-white transition-colors flex items-center gap-2">
              <Github className="w-4 h-4" />
              GitHub
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {authToken ? (
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  setAuthToken(null);
                }}
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/signin" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link href="/signup" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="grow pt-32 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-6 mb-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-zinc-400 mb-8 hover:bg-white/10 transition-colors cursor-default">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Open Source Collaborative Whiteboard
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight py-2 mb-6 bg-linear-to-b from-white to-white/50 bg-clip-text text-transparent max-w-4xl mx-auto">
            Hand-drawn look & feel for your diagrams.
          </h1>

          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            A virtual whiteboard for sketching hand-drawn like diagrams. Collaborative, end-to-end encrypted, and open source.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {authToken ? (
              <>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Room ID"
                    onChange={(e) => setRoomId(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all font-medium placeholder:text-zinc-600 w-40"
                  />
                  <button onClick={joinRoom} className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold text-lg transition-all hover:scale-105 cursor-pointer">
                    Join Room
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Room Name"
                    onChange={(e) => setRoomName(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all font-medium placeholder:text-zinc-600 w-40"
                  />
                  <button
                    onClick={createRoom}
                    className="group flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-semibold text-lg transition-all hover:scale-105 cursor-pointer"
                  >
                    Create Room <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/signup" 
              className="group flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105"
            >
              Start Drawing <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="https://github.com/bhaveshmpatel/excalidraw"
              target="_blank"
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-full font-medium text-lg transition-all"
            >
              View on GitHub
            </Link>
          </div>
            )}
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="container mx-auto px-6 mb-32">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Pencil className="w-6 h-6 text-purple-400" />}
              title="Hand-drawn Style"
              description="Create beautiful diagrams that look like they were drawn by hand. Perfect for wireframes and architecture."
            />
            <FeatureCard
              icon={<Share2 className="w-6 h-6 text-blue-400" />}
              title="Real-time Collaboration"
              description="Work together with your team in real-time. Share your whiteboard with a simple link."
            />
            <FeatureCard
              icon={<Layers className="w-6 h-6 text-green-400" />}
              title="End-to-end Encryption"
              description="Your data is secure. Drawings are end-to-end encrypted so only you and your keyholders can see them."
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 text-center">
          <div className="border border-white/10 bg-white/5 rounded-3xl p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-purple-500/10 to-transparent pointer-events-none"></div>

            <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Ready to create?</h2>
            <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto relative z-10">Join thousands of developers and designers who use Excalidraw to communicate their ideas.</p>
            <Link href="/signup" className="relative z-10 inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-zinc-200 transition-colors">
              Get Started for Free
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-black">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-zinc-500 text-sm">
          <div>&copy; {new Date().getFullYear()} Excalidraw Clone. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Twitter
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group">
      <div className="bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
}
