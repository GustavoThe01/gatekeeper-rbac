
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export const Forbidden: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
      <div className="text-6xl mb-4">🚫</div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('forbidden.title')}</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        {t('forbidden.message')}
      </p>
      <Link 
        to="/dashboard" 
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        {t('forbidden.button')}
      </Link>
    </div>
  );
};
