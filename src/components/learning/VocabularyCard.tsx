import { useState } from 'react';
import type { Word } from '../../types';

interface VocabularyCardProps {
  word: Word;
  onKnow: () => void;
  onDontKnow: () => void;
  isFlipped: boolean;
  onFlip: () => void;
}

export const VocabularyCard = ({
  word,
  onKnow,
  onDontKnow,
  isFlipped,
  onFlip
}: VocabularyCardProps) => {
  return (
    <div style={{ perspective: '1000px' }}>
      <div
        className={`relative w-full h-96 cursor-pointer transition-transform duration-600 ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
        onClick={onFlip}
      >
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 text-white">
            <p className="text-sm opacity-75 mb-4">点击卡片查看释义</p>
            <h3 className="text-4xl font-bold text-center mb-4">{word.english}</h3>
            <p className="text-lg opacity-90">{word.phonetic}</p>
          </div>
        </div>
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            backfaceVisibility: 'hidden', 
            transform: 'rotateY(180deg)' 
          }}
        >
          <div className="w-full h-full bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 border-2 border-indigo-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{word.chinese}</h3>
            <div className="bg-gray-50 rounded-xl p-4 mb-6 w-full">
              <p className="text-gray-700 italic text-center">"{word.example}"</p>
            </div>
            <div className="flex gap-3 w-full">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDontKnow();
                }}
                className="flex-1 py-3 px-4 bg-red-100 text-red-600 rounded-xl font-semibold hover:bg-red-200 transition-colors"
              >
                不认识
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onKnow();
                }}
                className="flex-1 py-3 px-4 bg-green-100 text-green-600 rounded-xl font-semibold hover:bg-green-200 transition-colors"
              >
                认识
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
