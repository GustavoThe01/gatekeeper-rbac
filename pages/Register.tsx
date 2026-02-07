import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../components/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState<File | undefined>(undefined);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [passwordStrength, setPasswordStrength] = useState(0); // 0-4 scale

  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, setLanguage, language } = useLanguage();
  const navigate = useNavigate();

  const languages = [
    { code: 'pt', flag: '🇧🇷' },
    { code: 'en', flag: '🇺🇸' },
    { code: 'es', flag: '🇪🇸' },
  ];

  useEffect(() => {
    calculatePasswordStrength(password);
  }, [password]);

  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return setPasswordStrength(0);

    if (pass.length > 5) score += 1;
    if (pass.length > 7) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

    setPasswordStrength(score);
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return 'bg-slate-200 dark:bg-slate-600';
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return 'bg-slate-200 dark:bg-slate-600';
    }
  };

  const getStrengthLabel = () => {
    switch (passwordStrength) {
      case 0: return '';
      case 1: return t('auth.weak');
      case 2: return t('auth.medium');
      case 3: return t('auth.good');
      case 4: return t('auth.strong');
      default: return '';
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(name, email, password, avatar);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      const errorMsg = t(err.message);
      setError(errorMsg === err.message ? t('errors.genericRegister') : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 transition-colors duration-500 ease-in-out relative">
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

      <div className="max-w-md w-full space-y-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl dark:shadow-blue-900/20 border border-slate-200 dark:border-slate-700 transition-all duration-200">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t('auth.registerTitle')}</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t('auth.joinToday')}</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg text-sm border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-3 rounded-lg text-sm border border-green-200 dark:border-green-800">
              {t('auth.accountCreated')}
            </div>
          )}
          
          <div className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <label className="cursor-pointer group relative">
                <div className="h-24 w-24 rounded-full bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-300 dark:border-slate-500 flex items-center justify-center overflow-hidden group-hover:border-blue-500 dark:group-hover:border-blue-400 transition-colors">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-slate-400 dark:text-slate-400 text-xs text-center px-2">{t('auth.addPhoto')}</span>
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarChange} 
                />
                <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 text-white shadow-sm hover:bg-blue-600 transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                   </svg>
                </div>
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-2">{t('auth.photoOptional')}</span>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('common.name')}</label>
              <input
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 sm:text-sm transition-all shadow-sm"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('common.email')}</label>
              <input
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 sm:text-sm transition-all shadow-sm"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('common.password')}</label>
              <input
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 sm:text-sm transition-all shadow-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              
              {/* Password Strength Indicator */}
              <div className="mt-3">
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ease-out ${getStrengthColor()}`} 
                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{t('auth.passwordStrength')}</span>
                  <span className={`text-xs font-bold ${
                    passwordStrength <= 1 ? 'text-red-500' :
                    passwordStrength === 2 ? 'text-yellow-600 dark:text-yellow-400' :
                    passwordStrength === 3 ? 'text-blue-600 dark:text-blue-400' :
                    'text-green-600 dark:text-green-400'
                  }`}>
                    {getStrengthLabel()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || success}
              className={`group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800 transition-all shadow-md hover:shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? t('common.processing') : t('auth.registerLink')}
            </button>
          </div>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t('auth.haveAccount')}{' '}
            <Link to="/login" className="font-bold text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:underline">
              {t('auth.loginLink')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};