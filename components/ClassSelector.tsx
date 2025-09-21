import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface ClassSelectorProps {
  onClassSelect: (grade: number) => void;
}

const ClassSelector: React.FC<ClassSelectorProps> = ({ onClassSelect }) => {
  const { t } = useLanguage();
  const classes = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen animate-fade-in">
      <div className="text-center p-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-extrabold text-brand-primary mb-2">{t('welcomeMessage')}</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">{t('welcomeSubtitle')}</p>
        <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-6">{t('selectClassPrompt')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {classes.map((grade) => (
            <button
              key={grade}
              onClick={() => onClassSelect(grade)}
              className="group flex flex-col items-center justify-center p-4 bg-brand-primary text-white rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300 ease-in-out hover:shadow-2xl hover:bg-indigo-700"
            >
              <span className="text-3xl font-black">{grade}</span>
              <span className="text-sm font-semibold opacity-80 group-hover:opacity-100">{t('classLabel')}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassSelector;