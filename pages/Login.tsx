import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../components/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, setLanguage, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || "/dashboard";

  const languages = [
    { code: 'pt', flag: '🇧🇷' },
    { code: 'en', flag: '🇺🇸' },
    { code: 'es', flag: '🇪🇸' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password, rememberMe);
      
      // Stop loading, trigger success animation
      setLoading(false);
      setIsSuccess(true);

      // Wait for animation to finish before navigating
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1500);

    } catch (err: any) {
      // Try to translate the error code, fallback to generic message if not found
      const errorMsg = t(err.message);
      setError(errorMsg === err.message ? t('errors.genericLogin') : errorMsg);
      setLoading(false);
      setIsSuccess(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 transition-colors duration-500 ease-in-out relative pb-20">
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

      <div className="max-w-md w-full space-y-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl dark:shadow-blue-900/20 border border-slate-200 dark:border-slate-700 transition-all duration-200 z-10">
        <div className="text-center">
          {/* Animated Lock/Key Icon Container */}
          <div className={`mx-auto h-16 w-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-all duration-500 cursor-pointer relative overflow-hidden group
            ${isSuccess 
              ? 'bg-green-500 shadow-green-500/50 scale-110' 
              : 'bg-blue-500 shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-105'
            }`}
          >
            {/* Lock Icon (Default) - Hides on Success or Hover */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-8 w-8 text-white absolute transition-all duration-500 ease-in-out 
                ${isSuccess ? 'opacity-0 scale-0 rotate-180' : 'group-hover:opacity-0 group-hover:scale-0 group-hover:rotate-180'}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            
            {/* Key Icon (Hover/Success) - Shows on Success or Hover */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-8 w-8 text-white absolute transition-all duration-500 ease-in-out
                ${isSuccess 
                  ? 'opacity-0 scale-0'
                  : 'opacity-0 scale-0 -rotate-180 group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0'
                }`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>

            {/* Success Checkmark Icon - Only shows on Success */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-8 w-8 text-white absolute transition-all duration-500 ease-in-out
                ${isSuccess ? 'opacity-100 scale-100 rotate-0 delay-100' : 'opacity-0 scale-0 rotate-180'}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">GateKeeper</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t('auth.loginTitle')}</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg text-sm border border-red-200 dark:border-red-800 flex items-center gap-2 animate-fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('common.email')}</label>
              <input
                type="email"
                required
                disabled={loading || isSuccess}
                className="appearance-none rounded-lg relative block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 sm:text-sm transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="admin@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('common.password')}</label>
              <input
                type="password"
                required
                disabled={loading || isSuccess}
                className="appearance-none rounded-lg relative block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 sm:text-sm transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                disabled={loading || isSuccess}
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 dark:text-slate-300 font-medium">
                {t('auth.rememberMe')}
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className={`font-medium text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:underline ${(loading || isSuccess) ? 'pointer-events-none opacity-50' : ''}`}>
                {t('auth.forgotPassword')}
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || isSuccess}
              className={`group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-500 shadow-md hover:shadow-lg overflow-hidden
                ${isSuccess 
                  ? 'bg-green-500 hover:bg-green-600 focus:ring-green-500 scale-105' 
                  : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500 dark:focus:ring-offset-slate-800'
                }
                ${loading ? 'cursor-wait opacity-90' : ''}
              `}
            >
              <div className="relative flex items-center justify-center w-full h-full">
                {/* Standard Text */}
                <span className={`transition-all duration-300 ${loading || isSuccess ? 'opacity-0 translate-y-8 absolute' : 'opacity-100 translate-y-0'}`}>
                  {t('auth.loginButton')}
                </span>

                {/* Loading State */}
                <span className={`absolute transition-all duration-300 flex items-center gap-2 ${loading ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('auth.verifying')}
                </span>

                {/* Success State */}
                <span className={`absolute transition-all duration-300 flex items-center gap-2 ${isSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t('auth.welcome')}
                </span>
              </div>
            </button>
          </div>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className={`font-bold text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:underline ${(loading || isSuccess) ? 'pointer-events-none opacity-50' : ''}`}>
              {t('auth.registerLink')}
            </Link>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-center text-slate-400 dark:text-slate-500 font-bold mb-3 uppercase tracking-wider">{t('auth.testAccounts')}</p>
          <div className="grid grid-cols-1 gap-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex justify-between p-2 bg-slate-50/80 dark:bg-slate-900/50 rounded border border-slate-200 dark:border-slate-700/50"><span>Admin:</span> <span className="font-mono font-medium">admin@test.com / password</span></div>
            <div className="flex justify-between p-2 bg-slate-50/80 dark:bg-slate-900/50 rounded border border-slate-200 dark:border-slate-700/50"><span>User:</span> <span className="font-mono font-medium">user@test.com / password</span></div>
            <div className="flex justify-between p-2 bg-slate-50/80 dark:bg-slate-900/50 rounded border border-slate-200 dark:border-slate-700/50"><span>Viewer:</span> <span className="font-mono font-medium">viewer@test.com / password</span></div>
          </div>
        </div>
      </div>

      {/* Login Page Signature - Fixed Bottom Bar */}
      <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm border-t border-slate-200/50 dark:border-slate-700/50">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <span>{t('common.developedBy')}</span>
          <span className="font-mono text-blue-600 dark:text-blue-400 font-bold text-sm">&lt;/&gt;</span>
          <span>{t('common.by')}</span>
          <span className="font-bold text-slate-700 dark:text-slate-200">Gustavo Osterno Thé</span>
        </p>

        <div className="flex items-center gap-4">
          {/* LinkedIn */}
          <a 
            href="https://www.linkedin.com/in/gustavoosterno/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group p-2 rounded-full bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
            aria-label="LinkedIn"
          >
            <svg className="h-6 w-6 fill-slate-500 dark:fill-slate-400 transition-colors duration-300 group-hover:fill-[#0077b5] transform group-hover:scale-110" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
          
          {/* GitHub */}
          <a 
            href="https://github.com/GustavoThe01" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group p-2 rounded-full bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
            aria-label="GitHub"
          >
            <svg className="h-6 w-6 fill-slate-500 dark:fill-slate-400 transition-colors duration-300 group-hover:fill-black dark:group-hover:fill-white transform group-hover:scale-110" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>

          {/* Instagram */}
          <a 
            href="https://www.instagram.com/gustavo.osterno/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group p-2 rounded-full bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
            aria-label="Instagram"
          >
            <svg className="h-6 w-6 fill-slate-500 dark:fill-slate-400 transition-colors duration-300 group-hover:fill-[#E1306C] transform group-hover:scale-110" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};