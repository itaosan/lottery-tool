import React from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ParticipantList } from './ParticipantList';

interface SettingsFormProps {
  title: string;
  duration: number;
  participants: string;
  prizeNames: string;
  onTitleChange: (title: string) => void;
  onDurationChange: (duration: number) => void;
  onParticipantsChange: (participants: string) => void;
  onPrizeNamesChange: (prizeNames: string) => void;
  onSubmit: () => void;
}

export function SettingsForm({ 
  title, 
  duration, 
  participants, 
  prizeNames,
  onTitleChange, 
  onDurationChange, 
  onParticipantsChange,
  onPrizeNamesChange,
  onSubmit 
}: SettingsFormProps) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-8">
      <div>
        <Label htmlFor="title">抽選のタイトル</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="抽選のタイトルを入力"
        />
      </div>
      <div>
        <Label htmlFor="prizeNames">賞の名前（1行につき1つ）</Label>
        <Textarea
          id="prizeNames"
          value={prizeNames}
          onChange={(e) => onPrizeNamesChange(e.target.value)}
          placeholder="賞の名前を入力（例：1等賞&#10;2等賞&#10;3等賞）"
          rows={5}
        />
      </div>
      <div>
        <Label htmlFor="duration">当選発表までの秒数</Label>
        <Input
          id="duration"
          type="number"
          value={duration}
          onChange={(e) => onDurationChange(Number.parseInt(e.target.value, 10))}
          min={1}
          max={60}
        />
      </div>
      <div className="mt-8">
        <ParticipantList
          participants={participants}
          onParticipantsChange={onParticipantsChange}
        />
      </div>
      <Button type="submit">設定を保存</Button>
    </form>
  );
}

