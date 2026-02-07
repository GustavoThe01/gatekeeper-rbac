
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types/user';
import { RoleGuard } from '../components/RoleGuard';
import { useLanguage } from '../contexts/LanguageContext';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const handleAction = (action: string) => {
    alert(`${t('dashboard.notImplemented')} (${action})`);
  };

  const handleExport = () => {
    alert(t('dashboard.exporting'));
  };

  const stats = [
    { label: t('dashboard.activeProjects'), value: '12', icon: '📁' },
    { label: t('dashboard.monthlyReports'), value: '48', icon: '📊' },
    { label: t('dashboard.pendingTasks'), value: '5', icon: '✅' },
  ];

  return (
    <div className="space-y-6">
      {/* Header wrapped in glass for better contrast against vibrant background */}
      <header className="mb-8 p-6 rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/50 dark:border-slate-700/50 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{t('dashboard.welcome')}, {user?.name}!</h1>
        <p className="text-slate-700 dark:text-slate-300 mt-1 font-medium">{t('dashboard.subtitle')}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div 
            key={stat.label} 
            className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/60 dark:border-slate-700 flex items-center space-x-4 cursor-pointer hover:shadow-xl transition-all duration-200 hover:-translate-y-1 hover:bg-white/90 dark:hover:bg-slate-800/90 group" 
            onClick={() => handleAction(`${stat.label}`)}
          >
            <div className="text-3xl bg-blue-100/80 dark:bg-blue-900/50 w-14 h-14 flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform shadow-inner">{stat.icon}</div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wide text-xs">{stat.label}</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/60 dark:border-slate-700 transition-all duration-200">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200/60 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('dashboard.recentActivity')}</h2>
            <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.USER]}>
               <button onClick={() => handleAction('Novo Evento')} className="text-blue-700 dark:text-blue-400 text-sm font-bold hover:underline">{t('dashboard.newEvent')}</button>
            </RoleGuard>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-4 pb-4 border-b border-slate-100/50 dark:border-slate-700/50 last:border-0 hover:bg-white/40 dark:hover:bg-slate-700/30 p-2 rounded-lg transition-colors -mx-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-sm">U{i}</div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">{t('dashboard.actionPerfomed')}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">{t('dashboard.minutesAgo').replace('minutos', `${i * 15}`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/60 dark:border-slate-700 transition-all duration-200">
          <div className="mb-6 pb-4 border-b border-slate-200/60 dark:border-slate-700">
             <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('dashboard.quickActions')}</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleAction('Ver Perfil')}
              className="p-4 bg-slate-50/80 dark:bg-slate-700/50 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-600 transition-all text-center border border-slate-200 dark:border-slate-600 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500"
            >
              {t('dashboard.viewProfile')}
            </button>
            <button 
              onClick={() => handleAction('Configurações')}
              className="p-4 bg-slate-50/80 dark:bg-slate-700/50 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-600 transition-all text-center border border-slate-200 dark:border-slate-600 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500"
            >
              {t('dashboard.settings')}
            </button>
            <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.USER]}>
              <button 
                onClick={handleExport}
                className="p-4 bg-blue-50/80 dark:bg-blue-900/20 rounded-lg text-sm font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all text-center border border-blue-100 dark:border-blue-800 hover:shadow-md hover:border-blue-300"
              >
                {t('dashboard.exportData')}
              </button>
            </RoleGuard>
            <RoleGuard allowedRoles={[UserRole.ADMIN]}>
              <button 
                onClick={() => handleAction('Log de Auditoria')}
                className="p-4 bg-indigo-50/80 dark:bg-indigo-900/20 rounded-lg text-sm font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all text-center border border-indigo-100 dark:border-indigo-800 hover:shadow-md hover:border-indigo-300"
              >
                {t('dashboard.auditLog')}
              </button>
            </RoleGuard>
          </div>
        </div>
      </div>
    </div>
  );
};
