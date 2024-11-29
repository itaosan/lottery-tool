import type React from 'react';
import { useRef, useState } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ParticipantList } from './ParticipantList';
import { type Settings, settingsToText, textToSettings } from '../utils/lottery';
import { MessageDialog } from './MessageDialog';
import { Download, Upload } from 'lucide-react'

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dialogMessage, setDialogMessage] = useState<{ title: string; message: string } | null>(null);

  const handleDownload = () => {
    const settings: Settings = { title, duration, participants, prizeNames };
    const text = settingsToText(settings);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lottery_settings.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const settings = textToSettings(text);
          onTitleChange(settings.title);
          onDurationChange(settings.duration);
          onParticipantsChange(settings.participants);
          onPrizeNamesChange(settings.prizeNames);
          console.log('Imported settings:', settings); // デバッグ用
          setDialogMessage({ title: '成功', message: '設定をインポートしました' });
        } catch (error) {
          console.error('Error parsing imported file:', error);
          setDialogMessage({ 
            title: 'エラー', 
            message: 'インポートしたファイルの形式が正しくありません。正しいフォーマットのファイルを選択してください。'
          });
        }
      };
      reader.onerror = () => {
        setDialogMessage({ 
          title: 'エラー', 
          message: 'ファイルの読み込み中にエラーが発生しました。もう一度お試しください。'
        });
      };
      reader.readAsText(file);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-8 relative">
      <h2 className="text-2xl font-bold text-center mb-6">抽選設定</h2>
      <div className="flex justify-end space-x-2 mb-4">
        <Button type="button" variant="outline" size="sm" onClick={handleDownload} className="bg-green-100 hover:bg-green-200 text-green-700">
          <Download className="w-4 h-4 mr-2" />
          エクスポート
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="bg-blue-100 hover:bg-blue-200 text-blue-700">
          <Upload className="w-4 h-4 mr-2" />
          インポート
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleUpload}
          accept=".txt"
        />
      </div>
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
      <div className="flex justify-center mt-8">
        <Button type="submit" size="lg">設定を保存</Button>
      </div>
      <MessageDialog
        isOpen={!!dialogMessage}
        onClose={() => setDialogMessage(null)}
        title={dialogMessage?.title || ''}
        message={dialogMessage?.message || ''}
      />
    </form>
  );
}

