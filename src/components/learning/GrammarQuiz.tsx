import { useState } from 'react';
import type { GrammarQuestion } from '../../types';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface GrammarQuizProps {
  question: GrammarQuestion;
  onAnswer: (correct: boolean) => void;
  onNext?: () => void;
  showResult?: boolean;
}

export const GrammarQuiz = ({
  question,
  onAnswer,
  onNext,
  showResult = false
}: GrammarQuizProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(showResult);

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    const isCorrect = index === question.correctAnswer;
    setShowExplanation(true);
    onAnswer(isCorrect);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (onNext) {
      onNext();
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">语法练习</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-medium text-gray-900 text-center mb-8">
          {question.question}
        </p>
        <div className="space-y-3">
          {question.options.map((option, index) => {
            let buttonClass = 'w-full py-4 px-6 text-left rounded-xl border-2 transition-all duration-200';
            if (selectedOption === null) {
              buttonClass += ' border-gray-200 hover:border-indigo-300 hover:bg-indigo-50';
            } else if (index === question.correctAnswer) {
              buttonClass += ' border-green-500 bg-green-50';
            } else if (index === selectedOption && index !== question.correctAnswer) {
              buttonClass += ' border-red-500 bg-red-50';
            } else {
              buttonClass += ' border-gray-200 opacity-50';
            }
            return (
              <button
                key={index}
                onClick={() => handleSelectOption(index)}
                disabled={selectedOption !== null}
                className={buttonClass}
              >
                <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            );
          })}
        </div>
        {showExplanation && (
          <div className={`mt-6 p-4 rounded-xl ${
            selectedOption === question.correctAnswer ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <p className="font-semibold text-gray-900 mb-2">
              {selectedOption === question.correctAnswer ? '正确！' : '不正确'}
            </p>
            <p className="text-gray-700 mb-4">{question.explanation}</p>
            {onNext && (
              <Button onClick={handleNext}>
                下一题
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
