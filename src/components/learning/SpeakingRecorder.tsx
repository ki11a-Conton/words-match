import { useState, useRef } from 'react';
import { Mic, Play, Square, Volume2, AlertCircle } from 'lucide-react';
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
  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const checkPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      setPermissionStatus(result.state);
      result.onchange = () => setPermissionStatus(result.state);
    } catch {
      // Permissions API not supported
    }
  };

  const startRecording = async () => {
    setError(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionStatus('granted');
      
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
      setPermissionStatus('denied');
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Microphone permission denied. Please allow microphone access in your browser settings to use this feature.');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone device.');
      } else if (err.name === 'NotReadableError') {
        setError('Microphone is being used by another application.');
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
    <Card className="max-w-2xl mx-auto glass-card">
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
          <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-800 font-medium mb-2">Microphone Access Required</p>
                <p className="text-amber-700 text-sm mb-3">{error}</p>
                <div className="text-xs text-amber-600 bg-amber-100/50 p-3 rounded-xl">
                  <p className="font-medium mb-1">How to enable microphone:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Click the microphone icon in your browser address bar</li>
                    <li>Select "Allow" for microphone access</li>
                    <li>Refresh the page and try again</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          {isRecording ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center animate-pulse shadow-xl">
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
            <div className="w-full text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200">
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
