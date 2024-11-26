import React from 'react';
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BackgroundEffect } from './BackgroundEffect';

interface LayoutProps {
  title: string;
  currentPrizeName: string;
  children: React.ReactNode;
  participantsList: React.ReactNode;
  participantsCount: number;
  winnersList: React.ReactNode;
  onOpenSettings: () => void;
  isSpinning: boolean;
}

export function Layout({ 
  title, 
  currentPrizeName,
  children, 
  participantsList, 
  participantsCount, 
  winnersList, 
  onOpenSettings, 
  isSpinning 
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-background p-8 relative overflow-hidden">
      <BackgroundEffect isActive={isSpinning} />
      <div className="max-w-[1920px] mx-auto relative z-10">
        <h1 className="text-4xl font-bold text-center mb-8">{title}</h1>
        {isSpinning ? (
          <div className="flex flex-col items-center justify-start h-[calc(100vh-8rem)]">
            {/* <h1 className="text-4xl font-bold text-center mb-4">{title}</h1> */} {/* Removed duplicated title */}
            <div className="w-full max-w-3xl mt-8"> {/* Added mt-8 class */}
              {children}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-[1fr_400px] gap-8">
            <div className="space-y-8">
              <Card className="p-8 relative">
                <h2 className="text-3xl font-bold text-center">{currentPrizeName}</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onOpenSettings}
                  className="absolute top-4 right-4"
                >
                  設定
                </Button>
              </Card>
              <Card className="p-4">
                {children}
              </Card>
              <Card className="p-4">
                <h2 className="text-2xl font-bold mb-2">当選者一覧</h2>
                <div className="h-[400px] overflow-y-auto pr-2">
                  {winnersList}
                </div>
              </Card>
            </div>
            <Card className="flex flex-col">
              <div className="p-4 flex-grow overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">参加者一覧</h2>
                  <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {participantsCount}人
                  </span>
                </div>
                <div className="h-full overflow-y-auto pr-2">
                  {participantsList}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

