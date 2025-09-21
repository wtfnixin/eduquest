import React, { useState, useCallback } from 'react';
import type { Subject, Lesson, QuizQuestion, Badge, View } from './types';
import { UserProgress } from './types';
import ClassSelector from './components/ClassSelector';
import Dashboard from './components/Dashboard';
import LessonView from './components/LessonView';
import QuizView from './components/QuizView';
import { ALL_BADGES } from './constants';
import LanguageSelector from './components/LanguageSelector';
import { useLanguage } from './contexts/LanguageContext';

const App: React.FC = () => {
  const [studentClass, setStudentClass] = useState<number | null>(null);
  const [currentView, setCurrentView] = useState<View>('classSelector');
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    points: 0,
    badges: [],
    completedTopics: {},
  });
  const [generatedLesson, setGeneratedLesson] = useState<Lesson | null>(null);
  const [generatedQuiz, setGeneratedQuiz] = useState<QuizQuestion[] | null>(null);
  const { language } = useLanguage();

  const handleClassSelect = (grade: number) => {
    setStudentClass(grade);
    setCurrentView('dashboard');
  };

  const handleSelectTopic = useCallback((subject: Subject, topic: string) => {
    setCurrentSubject(subject);
    setCurrentTopic(topic);
    setGeneratedLesson(null);
    setGeneratedQuiz(null);
    setCurrentView('lesson');
  }, []);

  const handleLessonComplete = (lesson: Lesson, quiz: QuizQuestion[]) => {
    setGeneratedLesson(lesson);
    setGeneratedQuiz(quiz);
    setCurrentView('quiz');
  };

  const handleQuizComplete = useCallback((score: number, totalQuestions: number) => {
    const pointsEarned = score * 10;
    
    setUserProgress(prev => {
      const newPoints = prev.points + pointsEarned;
      const newBadges: Badge[] = [...prev.badges];
      let newBadgeEarned: Badge | null = null;

      // Check for new badges
      ALL_BADGES.forEach(badge => {
        if (!newBadges.find(b => b.name === badge.name) && newPoints >= badge.points) {
          newBadges.push(badge);
          newBadgeEarned = badge;
        }
      });
      
      const newCompletedTopics = {...prev.completedTopics};
      if (currentSubject && currentTopic) {
        if (!newCompletedTopics[currentSubject.name]) {
          newCompletedTopics[currentSubject.name] = [];
        }
        if (!newCompletedTopics[currentSubject.name].includes(currentTopic)) {
            newCompletedTopics[currentSubject.name].push(currentTopic);
        }
      }

      return {
        points: newPoints,
        badges: newBadges,
        completedTopics: newCompletedTopics,
      };
    });
    
    setCurrentView('dashboard');
  }, [currentSubject, currentTopic]);
  
  const handleBackToDashboard = () => {
      setCurrentView('dashboard');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'classSelector':
        return <ClassSelector onClassSelect={handleClassSelect} />;
      case 'dashboard':
        return studentClass && <Dashboard 
          studentClass={studentClass} 
          userProgress={userProgress}
          onSelectTopic={handleSelectTopic} 
          language={language}
        />;
      case 'lesson':
        return studentClass && currentSubject && currentTopic && 
          <LessonView 
            studentClass={studentClass} 
            subject={currentSubject}
            topic={currentTopic}
            language={language}
            onLessonComplete={handleLessonComplete}
            onBack={handleBackToDashboard}
          />;
      case 'quiz':
        return generatedLesson && generatedQuiz &&
          <QuizView 
            lessonTitle={generatedLesson.title}
            questions={generatedQuiz}
            onQuizComplete={handleQuizComplete}
          />;
      default:
        return <ClassSelector onClassSelect={handleClassSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 font-sans text-brand-dark">
      <main className="container mx-auto p-4 md:p-8 relative">
        {currentView !== 'classSelector' && (
          <div className="absolute top-4 right-4 md:top-8 md:right-8 z-10">
            <LanguageSelector />
          </div>
        )}
        {renderContent()}
      </main>
    </div>
  );
};

export default App;