import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BackgroundEffectProps {
  isActive: boolean;
}

export function BackgroundEffect({ isActive }: BackgroundEffectProps) {
  const [effects, setEffects] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setEffects(prev => [
          ...prev.slice(-19),
          { id: Date.now(), x: Math.random() * 100, y: Math.random() * 100 }
        ]);
      }, 250);

      return () => clearInterval(interval);
    }
      setEffects([]);
  }, [isActive]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {effects.map(effect => (
          <motion.div
            key={effect.id}
            className="absolute w-16 h-16 rounded-full"
            style={{
              left: `${effect.x}%`,
              top: `${effect.y}%`,
              background: `hsl(${Math.random() * 360}, 100%, 50%)`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 2 }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

