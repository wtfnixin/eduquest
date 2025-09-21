import React, { useState } from 'react';
import type { QuizQuestion } from '../types';
import RewardModal from './RewardModal';
import { useLanguage } from '../contexts/LanguageContext';

interface QuizViewProps {
  lessonTitle: string;
  questions: QuizQuestion[];
  onQuizComplete: (score: number, totalQuestions: number) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ lessonTitle, questions, onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const { t } = useLanguage();

  const handleAnswerSelect = (answer: string) => {
    if (feedback) return; // Prevent changing answer after feedback

    const isCorrect = answer === questions[currentQuestionIndex].correctAnswer;
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setSelectedAnswers(prev => [...prev, answer]);

    setTimeout(() => {
        setFeedback(null);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    }, 1500);
  };
  
  const getButtonClass = (option: string) => {
    if(!feedback) {
        return 'bg-white hover:bg-indigo-100';
    }
    const isCorrect = option === questions[currentQuestionIndex].correctAnswer;
    if(isCorrect) return 'bg-green-500 text-white animate-bounce-slow';

    const isSelected = option === selectedAnswers[currentQuestionIndex];
    if(isSelected && !isCorrect) return 'bg-red-500 text-white';

    return 'bg-white opacity-60';
  }

  if (isFinished) {
    return (
        <RewardModal 
            score={score}
            totalQuestions={questions.length}
            onClose={() => onQuizComplete(score, questions.length)}
        />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="bg-white/90 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl animate-fade-in max-w-4xl mx-auto">
        <div className="mb-4">
            <p className="text-center text-sm text-gray-500 mb-2">{t('quizTimeLabel')}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-brand-secondary h-2.5 rounded-full" style={{ width: `${progressPercentage}%`, transition: 'width 0.5s ease-in-out' }}></div>
            </div>
        </div>
      <h2 className="text-center text-2xl md:text-3xl font-bold text-brand-dark mb-6">{currentQuestion.question}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            disabled={!!feedback}
            className={`w-full p-4 text-left font-semibold text-lg text-brand-dark rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 ${getButtonClass(option)}`}
          >
            {option}
          </button>
        ))}
      </div>
      {feedback && (
        <div className="mt-6 text-center text-2xl font-bold animate-fade-in">
          {feedback === 'correct' ? `🎉 ${t('correctFeedback')}` : `🤔 ${t('incorrectFeedback')}`}
        </div>
      )}
    </div>
  );
};

export default QuizView;