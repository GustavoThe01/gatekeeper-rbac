import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../components/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  
  const { requestPasswordReset } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, setLanguage, language } = useLanguage();

  const languages = [
    { code: 'pt', flag: '🇧🇷' },
    { code: 'en', flag: '🇺🇸' },
    { code: 'es', flag: '🇪🇸' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      await requestPasswordReset(email);
      setStatus('success');
      setMessage(t('auth.linkSent'));
    } catch (err: any) {
      setStatus('error');
      const errorMsg = t(err.message);
      setMessage(errorMsg === err.message ? 'Error' : errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 transition-colors duration-500 ease-in-out relative">
      {/* Top Controls */}
      <div className="absolute top-6 right-6 flex items-center space-x-3 z-10">
         <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full p-1 border border-slate-200 dark:border-slate-700 shadow-md flex">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as any)}
                className={`text-xl p-1.5 rounded-full transition-all ${language === lang.code ? 'bg-blue-100 dark:bg-slate-600 scale-110' : 'opacity-60 hover:opacity-100'}`}
              >
                {lang.flag}
              </button>
            ))}
         </div>
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-600 dark:text-slate-300 shadow-lg hover:shadow-xl transition-all duration-200 border border-slate-200 dark:border-slate-700 hover:scale-110"
          aria-label="Alternar tema"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="max-w-md w-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl dark:shadow-blue-900/20 border border-slate-200 dark:border-slate-700 transition-all duration-200">
        
        {/* Header */}
        <div className="text-center mb-8">
           {/* Animated Lock/Key Icon Container */}
           <div className="mx-auto h-16 w-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/40 group relative overflow-hidden transition-all duration-500 hover:shadow-blue-500/60 hover:scale-105 cursor-pointer">
            {/* Lock Icon (Default) */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-white absolute transition-all duration-500 ease-in-out group-hover:opacity-0 group-hover:scale-0 group-hover:rotate-180" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            
            {/* Key Icon (Hover) */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-white absolute transition-all duration-500 ease-in-out opacity-0 scale-0 -rotate-180 group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t('auth.recoverTitle')}</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {t('auth.recoverDesc')}
          </p>
        </div>

        {/* Success State */}
        {status === 'success' ? (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-4 rounded-lg text-sm border border-green-200 dark:border-green-800 flex items-center justify-center space-x-2">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
               </svg>
               <span>{message}</span>
            </div>
            <Link 
              to="/login"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md hover:shadow-lg"
            >
              {t('auth.backToLogin')}
            </Link>
          </div>
        ) : (
          /* Form State */
          <form className="space-y-6" onSubmit={handleSubmit}>
            {status === 'error' && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg text-sm border border-red-200 dark:border-red-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {message}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('common.email')}</label>
              <input
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 sm:text-sm transition-all shadow-sm"
                placeholder="Ex: admin@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className={`group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800 transition-all shadow-md hover:shadow-lg ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {status === 'loading' ? t('auth.sending') : t('auth.sendLink')}
            </button>

            <div className="text-center">
              <Link to="/login" className="font-medium text-sm text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 flex items-center justify-center space-x-1 transition-colors hover:underline">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>{t('auth.backToLogin')}</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};