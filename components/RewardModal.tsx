import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface RewardModalProps {
  score: number;
  totalQuestions: number;
  onClose: () => void;
}

const RewardModal: React.FC<RewardModalProps> = ({ score, totalQuestions, onClose }) => {
  const { t } = useLanguage();
  const percentage = Math.round((score / totalQuestions) * 100);
  const pointsEarned = score * 10;

  let message = '';
  if (percentage === 100) {
    message = t('perfectScoreMessage');
  } else if (percentage >= 75) {
    message = t('greatJobMessage');
  } else if (percentage >= 50) {
    message = t('goodEffortMessage');
  } else {
    message = t('keepTryingMessage');
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-yellow-200 to-orange-300 p-8 rounded-3xl shadow-2xl text-center max-w-md w-full relative transform scale-100 transition-transform duration-300">
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-8xl">🏆</div>
        <h2 className="text-4xl font-extrabold text-yellow-900 mt-12 mb-2">{t('quizCompleteTitle')}</h2>
        <p className="text-xl text-yellow-800 font-semibold mb-6">{message}</p>
        
        <div className="bg-white/50 rounded-xl p-4 mb-6">
          <p className="text-lg text-gray-700">{t('yourScoreLabel')}:</p>
          <p className="text-6xl font-black text-brand-primary">{score}<span className="text-3xl text-gray-600">/{totalQuestions}</span></p>
        </div>
        
        <div className="bg-green-100 border-2 border-dashed border-green-500 rounded-xl p-4 mb-8">
            <p className="text-lg font-bold text-green-700">{t('pointsEarnedLabel')}</p>
            <p className="text-4xl font-extrabold text-green-600">{pointsEarned} {t('pointsLabel')}!</p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 px-6 bg-brand-primary text-white text-lg font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors duration-300"
        >
          {t('backToDashboardButton')}
        </button>
      </div>
    </div>
  );
};

export default RewardModal;