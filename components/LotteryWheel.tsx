'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button"
import useSound from 'use-sound';
import { motion, AnimatePresence } from 'framer-motion';

interface LotteryWheelProps {
  participants: string[];
  duration: number;
  isSpinning: boolean;
  currentPrizeName: string;
  onWinnerSelected: (winner: string) => void;
  onSpinStart: () => void;
}

export function LotteryWheel({ participants, duration, isSpinning, currentPrizeName, onWinnerSelected, onSpinStart }: LotteryWheelProps) {
  const [currentName, setCurrentName] = useState('');
  const [winner, setWinner] = useState<string | null>(null);
  const [buttonColor, setButtonColor] = useState('bg-primary');
  const spinStartTime = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);
  const finalWinnerRef = useRef<string | null>(null);
  
  const [playDrumroll, { stop: stopDrumroll }] = useSound('/sounds/drumroll.mp3', { 
    loop: true 
  });
  const [playFanfare] = useSound('/sounds/fanfare.mp3');

  const getRandomName = useCallback(() => {
    return participants[Math.floor(Math.random() * participants.length)];
  }, [participants]);

  const calculateInterval = useCallback((elapsedTime: number) => {
    const minInterval = 50;
    const maxInterval = 1250;
    const progress = Math.pow(elapsedTime / duration, 3);
    return minInterval + (maxInterval - minInterval) * progress;
  }, [duration]);

  const animate = useCallback(() => {
    if (!spinStartTime.current) return;

    const now = Date.now();
    const elapsedTime = (now - spinStartTime.current) / 1000;

    if (elapsedTime < duration - 1) {
      setCurrentName(getRandomName());
      setButtonColor(`hsl(${Math.random() * 360}, 100%, 50%)`);
      const interval = calculateInterval(elapsedTime);
      animationRef.current = setTimeout(animate, interval);
    } else if (elapsedTime < duration && !finalWinnerRef.current) {
      finalWinnerRef.current = getRandomName();
      setCurrentName(finalWinnerRef.current);
      animationRef.current = setTimeout(animate, 1000);
    } else {
      stopDrumroll();
      const finalWinner = finalWinnerRef.current || getRandomName();
      setCurrentName(finalWinner);
      setWinner(finalWinner);
      setButtonColor('bg-primary');
      playFanfare();
      onWinnerSelected(finalWinner);
      finalWinnerRef.current = null;
    }
  }, [duration, calculateInterval, stopDrumroll, playFanfare, onWinnerSelected, getRandomName]);

  useEffect(() => {
    if (isSpinning) {
      playDrumroll();
      spinStartTime.current = Date.now();
      finalWinnerRef.current = null;
      animate();
    } else {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
        animationRef.current = null;
      }
      stopDrumroll();
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
        animationRef.current = null;
      }
      stopDrumroll();
    };
  }, [isSpinning, animate, playDrumroll, stopDrumroll]);

  const startSpin = () => {
    onSpinStart();
    setWinner(null);
    setCurrentName(getRandomName());
  };

  return (
    <div className="flex flex-col items-center justify-start w-full">
      <AnimatePresence>
        {isSpinning && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-7xl font-bold mb-6"
            >
              {currentPrizeName}
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-full bg-white relative flex flex-col items-center justify-center p-6 rounded-lg border-8 border-black mb-8"
            >
              <div className={`text-7xl font-bold ${winner === currentName ? 'text-primary' : 'text-gray-800'}`}>
                {currentName}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <div className={`mt-8 w-full flex justify-center ${!isSpinning ? 'scale-125' : ''}`}>
        <Button 
          size="lg"
          onClick={startSpin} 
          disabled={isSpinning}
          className={`text-3xl px-12 py-8 rounded-full transition-all duration-300 ${isSpinning ? buttonColor : 'bg-primary'}`}
          style={{ backgroundColor: isSpinning ? buttonColor : '' }}
        >
          {isSpinning ? '抽選中...' : '抽選開始'}
        </Button>
      </div>
    </div>
  );
}

