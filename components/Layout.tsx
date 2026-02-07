import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from './ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { UserRole } from '../types/user';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: t('sidebar.dashboard'), icon: '🏠', roles: [UserRole.ADMIN, UserRole.USER, UserRole.VIEWER] },
    { path: '/admin', label: t('sidebar.adminAccess'), icon: '🛡️', roles: [UserRole.ADMIN] },
  ];

  const languages = [
    { code: 'pt', flag: '🇧🇷' },
    { code: 'en', flag: '🇺🇸' },
    { code: 'es', flag: '🇪🇸' },
  ];

  return (
    <div className="min-h-screen flex transition-colors duration-500 ease-in-out">
      {/* Sidebar - Enhanced Glassy look */}
      <aside className="w-64 bg-white/70 dark:bg-slate-900/80 backdrop-blur-lg border-r border-white/20 dark:border-slate-700/50 flex flex-col hidden md:flex transition-colors duration-500 ease-in-out shadow-2xl z-10">
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white font-bold">G</span>
            </div>
            <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">GateKeeper</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            item.roles.includes(user?.role as UserRole) && (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                  location.pathname === item.path 
                    ? 'bg-blue-600/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200/50 dark:border-blue-500/30' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          ))}
        </nav>

        <div className="p-4 space-y-4 border-t border-slate-200/50 dark:border-slate-700/50">
           {/* Language Switcher */}
           <div className="flex justify-around p-2 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-white/50 dark:border-slate-700/50">
             {languages.map((lang) => (
               <button
                 key={lang.code}
                 onClick={() => setLanguage(lang.code as any)}
                 className={`text-xl p-1 rounded transition-transform hover:scale-110 ${language === lang.code ? 'bg-white dark:bg-slate-700 shadow-sm' : 'opacity-50 hover:opacity-100'}`}
                 title={lang.code.toUpperCase()}
               >
                 {lang.flag}
               </button>
             ))}
           </div>

           {/* Theme Toggle */}
           <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/80 rounded-lg transition-colors border border-slate-200/50 dark:border-slate-700"
          >
            <span className="flex items-center space-x-2">
              <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
              <span>{theme === 'dark' ? t('sidebar.darkMode') : t('sidebar.lightMode')}</span>
            </span>
          </button>

          <div className="flex items-center space-x-3 p-3 bg-white/40 dark:bg-slate-800/40 rounded-xl border border-white/50 dark:border-slate-700/50 shadow-sm">
            <img src={user?.avatar} alt={user?.name} className="h-10 w-10 rounded-full border-2 border-white dark:border-slate-600 shadow-sm" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{user?.name}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900"
          >
            <span>🚪</span>
            <span>{t('sidebar.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative scroll-smooth flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">G</div>
            <span className="font-bold text-slate-800 dark:text-white">GateKeeper</span>
          </div>
          <div className="flex items-center space-x-3">
             <div className="flex space-x-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as any)}
                    className={`text-sm p-1 ${language === lang.code ? 'opacity-100' : 'opacity-40'}`}
                  >
                    {lang.flag}
                  </button>
                ))}
             </div>
             <button onClick={toggleTheme} className="text-xl p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
               {theme === 'dark' ? '🌙' : '☀️'}
             </button>
             <button onClick={logout} className="text-xs font-bold text-red-600 dark:text-red-400 border border-red-200 px-2 py-1 rounded hover:bg-red-50">{t('sidebar.logoutMobile')}</button>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto p-6 md:p-10 w-full flex-1">
          <Outlet />
        </div>

        {/* Developer Signature Footer */}
        <footer className="w-full p-6 border-t border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md mt-auto transition-colors duration-500 ease-in-out">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <span>{t('common.developedBy')}</span>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold text-base">&lt;/&gt;</span>
              <span>{t('common.by')}</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">Gustavo Osterno Thé</span>
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
        </footer>
      </main>
    </div>
  );
};