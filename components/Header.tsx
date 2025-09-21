import React from 'react';
import type { UserProgress } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  studentClass: number;
  userProgress: UserProgress;
}

const Header: React.FC<HeaderProps> = ({ studentClass, userProgress }) => {
  const { t } = useLanguage();
  return (
    <header className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg mb-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary">{t('dashboardTitle')}</h1>
          <p className="text-gray-500">{t('classLabel')} {studentClass} - {t('dashboardSubtitle')}</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <span className="text-2xl font-bold text-yellow-500">⭐️</span>
            <p className="text-lg font-semibold">{userProgress.points} <span className="text-sm text-gray-500">{t('pointsLabel')}</span></p>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold">🏆</span>
            <p className="text-lg font-semibold">{userProgress.badges.length} <span className="text-sm text-gray-500">{t('badgesLabel')}</span></p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;