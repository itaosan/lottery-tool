'use client'

import React, { useState, useCallback } from 'react';
import { Layout } from '../components/Layout';
import { SettingsForm } from '../components/SettingsForm';
import { LotteryWheel } from '../components/LotteryWheel';
import { WinnerAnnouncement } from '../components/WinnerAnnouncement';
import { WinnersList } from '../components/WinnersList';
import { parseParticipants, createWeightedList, type Participant } from '../utils/lottery';

const generateRandomColors = (count: number): string[] => {
  return Array.from({ length: count }, () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 80%)`;
  });
};

export default function Home() {
  const [title, setTitle] = useState('おたのしみ抽選会');
  const [duration, setDuration] = useState(15);
  const [participants, setParticipants] = useState('');
  const [prizeNames, setPrizeNames] = useState('〇〇賞\n■■賞\n▲▲賞');
  const [currentPrizeIndex, setCurrentPrizeIndex] = useState(0);
  const [parsedParticipants, setParsedParticipants] = useState<Participant[]>([]);
  const [weightedList, setWeightedList] = useState<string[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [winners, setWinners] = useState<{ name: string; prize: string; color: string }[]>([]);
  const [showSettings, setShowSettings] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [colorList, setColorList] = useState<string[]>([]);

  const currentPrizeName = prizeNames.split('\n')[currentPrizeIndex] || '';

  const handleSettingsSubmit = useCallback(() => {
    const parsed = parseParticipants(participants);
    setParsedParticipants(parsed);
    setWeightedList(createWeightedList(parsed));
    setColorList(generateRandomColors(parsed.length));
    setShowSettings(false);
  }, [participants]);

  const handleWinnerSelected = useCallback((selectedWinner: string) => {
    setWinner(selectedWinner);
    setIsSpinning(false);
  }, []);

  const handleWinnerAnnouncementClose = useCallback(() => {
    if (winner) {
      const currentPrizeName = prizeNames.split('\n')[currentPrizeIndex] || '';
      const color = colorList[winners.length % colorList.length];
      setWinners(prev => [...prev, { name: winner, prize: currentPrizeName, color }]);
      const newParticipants = parsedParticipants.filter(p => p.name !== winner);
      setParsedParticipants(newParticipants);
      setWeightedList(createWeightedList(newParticipants));
      setWinner(null);
      setCurrentPrizeIndex(prevIndex => prevIndex + 1);
    }
  }, [winner, parsedParticipants, prizeNames, currentPrizeIndex, colorList, winners.length]);

  const handleSpinStart = useCallback(() => {
    setIsSpinning(true);
  }, []);

  const participantsListContent = (
    <div className="space-y-1">
      {parsedParticipants.map((participant, index) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={index}
          className="p-2 bg-primary/5 rounded-md flex items-center justify-between text-sm"
        >
          <span className="truncate">{participant.name}</span>
          <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
            {participant.multiplier}倍
          </span>
        </div>
      ))}
    </div>
  );

  if (showSettings) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <SettingsForm
          title={title}
          duration={duration}
          participants={participants}
          prizeNames={prizeNames}
          onTitleChange={setTitle}
          onDurationChange={setDuration}
          onParticipantsChange={setParticipants}
          onPrizeNamesChange={setPrizeNames}
          onSubmit={handleSettingsSubmit}
        />
      </div>
    );
  }

  return (
    <>
      <Layout
        title={title}
        currentPrizeName={currentPrizeName}
        participantsList={participantsListContent}
        participantsCount={parsedParticipants.length}
        winnersList={<WinnersList winners={winners} />}
        onOpenSettings={() => setShowSettings(true)}
        isSpinning={isSpinning}
      >
        <LotteryWheel
          participants={weightedList}
          duration={duration}
          isSpinning={isSpinning}
          currentPrizeName={currentPrizeName}
          onWinnerSelected={handleWinnerSelected}
          onSpinStart={handleSpinStart}
        />
      </Layout>
      <WinnerAnnouncement 
        winner={winner} 
        currentPrizeName={currentPrizeName}
        onClose={handleWinnerAnnouncementClose} 
      />
    </>
  );
}

