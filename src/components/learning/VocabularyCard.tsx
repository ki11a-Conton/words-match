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
    <div className="perspective-1000">
      <div
        className={`card-flip relative w-full h-96 cursor-pointer ${isFlipped ? 'flipped' : ''}`}
        onClick={onFlip}
      >
        {/* Front of card */}
        <div className="card-face absolute inset-0 w-full h-full">
          <div className="w-full h-full bg-gradient-to-b from-[#007AFF] to-[#5856D6] rounded-[var(--radius-2xl)] shadow-[0_8px_32px_rgba(0,122,255,0.3)] flex flex-col items-center justify-center p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl" />
            
            <div className="relative z-10 text-center">
              <p className="text-sm opacity-70 mb-6 font-medium tracking-wide">Tap to flip</p>
              <h3 className="text-5xl font-bold mb-4 tracking-tight">{word.english}</h3>
              <p className="text-xl opacity-90 font-light">{word.phonetic}</p>
              <div className="mt-6 px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                {word.difficulty === 'easy' ? 'Beginner' : word.difficulty === 'medium' ? 'Intermediate' : 'Advanced'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Back of card */}
        <div className="card-face card-back absolute inset-0 w-full h-full">
          <div className="w-full h-full glass-card rounded-[var(--radius-2xl)] flex flex-col items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#007AFF] via-[#5856D6] to-[#AF52DE]" />
            
            <div className="relative z-10 w-full">
              <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-3 text-center">{word.chinese}</h3>
              <div className="bg-[rgba(120,120,128,0.08)] rounded-[var(--radius-lg)] p-5 mb-8">
                <p className="text-[var(--text-secondary)] italic text-center text-lg leading-relaxed">"{word.example}"</p>
              </div>
              <div className="flex gap-3 w-full">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDontKnow();
                  }}
                  className="flex-1 py-4 px-5 bg-[rgba(255,59,48,0.08)] text-[var(--error)] rounded-[var(--radius-lg)] font-semibold transition-all duration-[var(--duration-fast)] ease-[var(--spring-smooth)] active:scale-[0.97] active:bg-[rgba(255,59,48,0.12)]"
                >
                  Still Learning
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onKnow();
                  }}
                  className="flex-1 py-4 px-5 bg-[rgba(52,199,89,0.08)] text-[var(--success)] rounded-[var(--radius-lg)] font-semibold transition-all duration-[var(--duration-fast)] ease-[var(--spring-smooth)] active:scale-[0.97] active:bg-[rgba(52,199,89,0.12)]"
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
