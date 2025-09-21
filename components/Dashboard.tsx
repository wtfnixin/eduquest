import React, { useState, useEffect } from 'react';
import type { Subject, UserProgress, Language } from '../types';
import { SUBJECTS } from '../constants';
import Header from './Header';
import { getNcertTopics } from '../services/geminiService';
import Spinner from './Spinner';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
  studentClass: number;
  userProgress: UserProgress;
  onSelectTopic: (subject: Subject, topic: string) => void;
  language: Language;
}

const SubjectCard: React.FC<{
    subject: Subject;
    onSelectTopic: (subject: Subject, topic: string) => void;
    completedTopics: string[];
    studentClass: number;
    language: Language;
}> = ({ subject, onSelectTopic, completedTopics = [], studentClass, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [topics, setTopics] = useState<string[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();
  
  const progressPercentage = topics.length > 0 ? Math.round((completedTopics.length / topics.length) * 100) : 0;

  useEffect(() => {
    const fetchTopics = async () => {
        if (isOpen && topics.length === 0) {
            setIsLoadingTopics(true);
            setError(null);
            try {
                const fetchedTopics = await getNcertTopics(subject.name, studentClass, language.name);
                setTopics(fetchedTopics);
            } catch (err) {
                setError('Could not load topics. Please try again.');
                console.error(err);
            } finally {
                setIsLoadingTopics(false);
            }
        }
    };
    fetchTopics();
  }, [isOpen, subject.name, studentClass, language, topics.length]);

  return (
    <div className={`p-6 rounded-2xl shadow-lg text-white transition-all duration-300 ${subject.color}`}>
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center space-x-4">
          {subject.icon}
          <h3 className="text-2xl font-bold">{t(subject.nameKey)}</h3>
        </div>
        <div className="flex items-center space-x-2">
            <span className="font-semibold">{progressPercentage}%</span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
      </div>
      
      <div className="mt-4 bg-white/30 rounded-full h-2.5">
          <div className="bg-white h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-white/30 animate-fade-in">
          {isLoadingTopics && <div className="flex justify-center items-center p-4"><div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-white"></div></div>}
          {error && <p className="text-center text-white bg-red-500/50 p-2 rounded-lg">{error}</p>}
          {!isLoadingTopics && !error && (
            <>
                <h4 className="font-semibold text-lg mb-2">{t('topicsLabel')}:</h4>
                <ul className="space-y-2">
                    {topics.map((topic) => (
                    <li
                        key={topic}
                        onClick={() => onSelectTopic(subject, topic)}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/20 hover:bg-white/40 cursor-pointer transition-colors duration-200"
                    >
                        <span>{topic}</span>
                        {completedTopics.includes(topic) ? (
                            <span className="text-xl" title={t('completedBadge')}>✅</span>
                        ) : (
                            <span className="text-gray-200" title={t('nextArrow')}>➡️</span>
                        )}
                    </li>
                    ))}
                </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ studentClass, userProgress, onSelectTopic, language }) => {
  return (
    <div className="animate-fade-in">
      <Header studentClass={studentClass} userProgress={userProgress} />
      <div className="grid md:grid-cols-2 gap-8">
        {SUBJECTS.map((subject) => (
          <SubjectCard 
            key={subject.name} 
            subject={subject} 
            onSelectTopic={onSelectTopic}
            completedTopics={userProgress.completedTopics[subject.name] || []}
            studentClass={studentClass}
            language={language}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;