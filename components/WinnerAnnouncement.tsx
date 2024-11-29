import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import confetti, { type Shape } from "canvas-confetti";

interface WinnerAnnouncementProps {
  winner: string | null;
  currentPrizeName: string;
  onClose: () => void;
}

export function WinnerAnnouncement({ winner, currentPrizeName, onClose }: WinnerAnnouncementProps) {
  useEffect(() => {
    if (winner) {
      const duration = 15 * 1000; // 15 seconds
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10001 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval: NodeJS.Timeout = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"],
            shapes: ["circle", "square", "star"] as Shape[],
            scalar: randomInRange(1, 2),
          })
        );
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"],
            shapes: ["circle", "square", "star"] as Shape[],
            scalar: randomInRange(1, 2),
          })
        );
      }, 250);

      return () => clearInterval(interval);
    }
  }, [winner]);

  if (!winner) return null;

  return (
    <Dialog open={!!winner} onOpenChange={onClose}>
      <DialogContent
        className="max-w-full max-h-full w-screen h-screen flex flex-col items-center justify-center bg-black bg-opacity-70"
        style={{ zIndex: 9999 }}
        onClick={onClose}
      >
        <DialogHeader>
          <DialogTitle className="text-6xl font-bold text-center text-white mb-8">
            🎉 {currentPrizeName} 当選者 🎉
          </DialogTitle>
        </DialogHeader>
        <div className="flex-grow flex items-center justify-center relative">
          <div
            className="text-9xl font-bold text-white animate-bounce p-12 rounded-lg"
            style={{
              zIndex: 10000,
              textShadow:
                "0 0 10px rgba(0,149,255,0.5), 0 0 20px rgba(0,149,255,0.5), 0 0 30px rgba(0,149,255,0.5), 0 0 40px #0095ff, 0 0 70px #0095ff, 0 0 80px #0095ff, 0 0 100px #0095ff, 0 0 150px #0095ff",
            }}
          >
            {winner}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
