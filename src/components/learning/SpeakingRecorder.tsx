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
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    setError(null);
    
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
      setAudioUrl(null);
      setShowScore(false);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(t => t + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Error accessing microphone:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Microphone permission denied. Please allow microphone access in your browser settings and try again.');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone and try again.');
      } else {
        setError('Unable to access microphone. Please check your browser settings.');
      }
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
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    setAudioUrl(null);
    setShowScore(false);
    setError(null);
    onComplete();
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Speaking Practice</CardTitle>
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
            Play Standard Pronunciation
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-yellow-800 text-sm">{error}</p>
            <p className="text-yellow-700 text-xs mt-2">
              Tip: Click the microphone icon in your browser address bar to enable microphone access.
            </p>
          </div>
        )}

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
                Stop Recording
              </Button>
            </div>
          ) : (
            <Button
              size="lg"
              icon={<Mic size={24} />}
              onClick={startRecording}
              disabled={showScore}
            >
              Start Recording
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
                Play Recording
              </Button>
            </div>
          )}

          {showScore && (
            <div className="w-full text-center p-6 bg-green-50 rounded-2xl border border-green-200">
              <p className="text-3xl font-bold text-green-600 mb-2">85 Points</p>
              <p className="text-gray-600 mb-4">Great pronunciation! Keep it up!</p>
              <Button onClick={handleNext}>
                Next Sentence
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
