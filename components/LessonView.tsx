import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Subject, Language, Lesson, QuizQuestion } from '../types';
import { generateLessonAndQuiz } from '../services/geminiService';
import Spinner from './Spinner';
import { useLanguage } from '../contexts/LanguageContext';

interface LessonViewProps {
  studentClass: number;
  subject: Subject;
  topic: string;
  language: Language;
  onLessonComplete: (lesson: Lesson, quiz: QuizQuestion[]) => void;
  onBack: () => void;
}

const LessonView: React.FC<LessonViewProps> = ({ studentClass, subject, topic, language, onLessonComplete, onBack }) => {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();
  
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const fetchLessonContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { lesson, quiz } = await generateLessonAndQuiz(subject.name, topic, studentClass, language.name);
      setLesson(lesson);
      setQuiz(quiz);
    } catch (err) {
      setError(t('lessonError'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [subject, topic, studentClass, language, t]);

  useEffect(() => {
    fetchLessonContent();
  }, [fetchLessonContent]);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current || !touchStartY.current) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;

    touchStartX.current = null;
    touchStartY.current = null;

    // Check for a clear swipe right gesture
    if (Math.abs(deltaY) < 50 && deltaX > 75) {
        onBack();
    }
  };

  const handleStartQuiz = () => {
    if (lesson && quiz) {
      onLessonComplete(lesson, quiz);
    }
  };
  
  const loadingMessages = [
      t('loadingMessage1'),
      t('loadingMessage2'),
      t('loadingMessage3'),
      t('loadingMessage4'),
  ];
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  
  useEffect(() => {
    if (isLoading) {
      const intervalId = setInterval(() => {
        setLoadingMessage(prev => {
          const currentIndex = loadingMessages.indexOf(prev);
          const nextIndex = (currentIndex + 1) % loadingMessages.length;
          return loadingMessages[nextIndex];
        });
      }, 2000);
      return () => clearInterval(intervalId);
    }
  }, [isLoading, loadingMessages]);

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8">
            <Spinner message={loadingMessage} />
        </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl">
        <p className="text-red-500 font-semibold mb-4">{error}</p>
        <button onClick={onBack} className="px-6 py-2 bg-brand-primary text-white rounded-lg shadow-md hover:bg-indigo-700 transition">{t('backToDashboardButton')}</button>
      </div>
    );
  }

  return (
    <div 
      className="bg-white/90 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl animate-slide-in-up"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
        <div className="flex justify-between items-start mb-6">
            <div>
                <h2 className="text-3xl font-extrabold text-brand-primary">{lesson?.title}</h2>
                <p className="text-gray-500">{t(subject.nameKey)} - {topic}</p>
            </div>
            <button onClick={onBack} className="p-2 rounded-full text-gray-500 hover:text-brand-primary hover:bg-gray-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
        </div>
      
      <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
        {lesson?.story.map((part, index) => {
          if (part.type === 'challenge') {
            return (
              <div key={index} className="bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded-r-lg not-prose">
                  <div className="flex items-start space-x-3">
                      <span className="text-2xl">💡</span>
                      <p className="font-semibold text-yellow-800">{part.content}</p>
                  </div>
              </div>
            );
          }
          return <p key={index} className="whitespace-pre-wrap">{part.content}</p>;
        })}
      </div>

      <div className="mt-8 text-center">
        <button 
          onClick={handleStartQuiz} 
          className="px-8 py-3 text-lg font-bold text-white bg-brand-secondary rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
        >
          {t('startQuizButton')}
        </button>
      </div>
    </div>
  );
};

export default LessonView;