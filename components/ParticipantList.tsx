import React from 'react';
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface ParticipantListProps {
  participants: string;
  onParticipantsChange: (participants: string) => void;
}

export function ParticipantList({ participants, onParticipantsChange }: ParticipantListProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="participants">参加者リスト</Label>
        <Textarea
          id="participants"
          value={participants}
          onChange={(e) => onParticipantsChange(e.target.value)}
          placeholder="参加者を入力（例: 山田太郎,10）"
          rows={10}
        />
      </div>
    </div>
  );
}

