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
        className="relative w-full h-96 cursor-pointer"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.7s ease-in-out',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
        onClick={onFlip}
      >
        {/* Front of card */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />
            
            <div className="relative z-10 text-center">
              <p className="text-sm opacity-75 mb-6">Tap to flip</p>
              <h3 className="text-5xl font-bold mb-4">{word.english}</h3>
              <p className="text-xl opacity-90">{word.phonetic}</p>
              <div className="mt-6 px-4 py-1.5 bg-white/20 rounded-full text-sm">
                {word.difficulty === 'easy' ? 'Beginner' : word.difficulty === 'medium' ? 'Intermediate' : 'Advanced'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Back of card */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            backfaceVisibility: 'hidden', 
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="w-full h-full bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            
            <div className="relative z-10 w-full">
              <h3 className="text-3xl font-bold text-gray-900 mb-3 text-center">{word.chinese}</h3>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-5 mb-8 border border-gray-100">
                <p className="text-gray-600 italic text-center text-lg">"{word.example}"</p>
              </div>
              <div className="flex gap-4 w-full">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDontKnow();
                  }}
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-red-50 to-red-100 text-red-600 rounded-2xl font-semibold hover:from-red-100 hover:to-red-200 transition-all duration-300 border border-red-200 hover:shadow-lg"
                >
                  Still Learning
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onKnow();
                  }}
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-green-50 to-green-100 text-green-600 rounded-2xl font-semibold hover:from-green-100 hover:to-green-200 transition-all duration-300 border border-green-200 hover:shadow-lg"
                >
                  Got It!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
