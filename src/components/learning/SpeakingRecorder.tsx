import { useState, useRef } from 'react';
import { Mic, Play, Square, Volume2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface SpeakingRecorderProps {
  text: string;
  translation: string;
  onComplete: () => void;
}

export const SpeakingRecorder = ({ text, translation, onComplete }: SpeakingRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [showScore, setShowScore] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setShowScore(true);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(t => t + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const speakText = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">口语跟读</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl">
          <p className="text-2xl font-bold text-gray-900 mb-2">{text}</p>
          <p className="text-gray-600 mb-4">{translation}</p>
          <Button
            variant="ghost"
            icon={<Volume2 size={20} />}
            onClick={speakText}
          >
            播放标准发音
          </Button>
        </div>
        <div className="flex flex-col items-center gap-4">
          {isRecording ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
                <Square size={48} className="text-white" />
              </div>
              <p className="text-2xl font-mono font-bold text-red-600">
                {formatTime(recordingTime)}
              </p>
              <Button
                variant="danger"
                size="lg"
                icon={<Square size={20} />}
                onClick={stopRecording}
              >
                停止录音
              </Button>
            </div>
          ) : (
            <Button
              size="lg"
              icon={<Mic size={24} />}
              onClick={startRecording}
              disabled={showScore}
            >
              开始录音
            </Button>
          )}
          {audioUrl && (
            <div className="w-full flex flex-col items-center gap-3">
              <audio src={audioUrl} controls className="w-full" />
              <Button
                variant="outline"
                icon={<Play size={20} />}
                onClick={playAudio}
              >
                播放录音
              </Button>
            </div>
          )}
          {showScore && (
            <div className="w-full text-center p-6 bg-green-50 rounded-2xl border border-green-200">
              <p className="text-3xl font-bold text-green-600 mb-2">85 分</p>
              <p className="text-gray-600 mb-4">发音很不错！继续加油！</p>
              <Button onClick={onComplete}>
                下一句
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
