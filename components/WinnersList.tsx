import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area"

interface WinnersListProps {
  winners: { name: string; prize: string; color: string }[];
}

export function WinnersList({ winners }: WinnersListProps) {
  return (
    <ScrollArea className="h-full w-full">
      <div className="space-y-2">
        {winners.map((winner, index) => (
          <div
            key={`${winner.name}-${winner.prize}-${index}`}
            className="p-3 rounded-lg flex items-center justify-between"
            style={{ backgroundColor: winner.color }}
          >
            <span className="text-3xl font-bold">{winner.name}</span>
            <span className="text-3xl font-bold">
              {winner.prize}
            </span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

