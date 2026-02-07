
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'pt' | 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// --- Dicionário de Traduções ---
// Organizado por idioma e namespace (common, auth, errors, etc.)
const translations = {
  pt: {
    common: {
      email: 'Email',
      password: 'Senha',
      name: 'Nome Completo',
      save: 'Salvar',
      cancel: 'Cancelar',
      edit: 'Editar',
      delete: 'Excluir',
      loading: 'Carregando...',
      processing: 'Processando...',
      success: 'Sucesso',
      error: 'Erro',
      back: 'Voltar',
      actions: 'Ações',
      search: 'Buscar',
      developedBy: 'Desenvolvido com',
      by: 'por',
      admin: 'Admin',
      user: 'Usuário',
      viewer: 'Visualizador',
      status: 'Status',
      active: 'Ativo',
      role: 'Perfil',
    },
    auth: {
      loginTitle: 'Faça login na sua conta',
      loginButton: 'Entrar',
      verifying: 'Verificando...',
      welcome: 'Bem-vindo!',
      rememberMe: 'Lembrar-me',
      forgotPassword: 'Esqueceu sua senha?',
      noAccount: 'Não tem uma conta?',
      registerLink: 'Cadastre-se',
      registerTitle: 'Criar conta',
      joinToday: 'Junte-se ao GateKeeper hoje',
      addPhoto: 'Adicionar Foto',
      photoOptional: 'Opcional. Max 2MB.',
      passwordStrength: 'Força da senha',
      weak: 'Fraca',
      medium: 'Média',
      good: 'Boa',
      strong: 'Forte',
      haveAccount: 'Já tem uma conta?',
      loginLink: 'Faça login',
      recoverTitle: 'Recuperar Senha',
      recoverDesc: 'Não se preocupe, acontece! Digite seu email abaixo para recuperar sua conta.',
      sendLink: 'Enviar Link de Recuperação',
      sending: 'Enviando...',
      backToLogin: 'Voltar para o Login',
      linkSent: 'Enviamos um link de recuperação para o seu email.',
      accountCreated: 'Conta criada com sucesso! Redirecionando...',
      testAccounts: 'Contas de Teste',
    },
    errors: {
      invalidCredentials: 'Credenciais inválidas. Tente admin@test.com / password',
      emailInUse: 'Este email já está em uso.',
      emailNotFound: 'Email não encontrado no sistema.',
      genericLogin: 'Erro ao fazer login',
      genericRegister: 'Erro ao registrar',
      genericSave: 'Erro ao salvar usuário',
      selfDelete: 'Você não pode excluir a si mesmo.',
      deleteConfirm: 'Tem certeza que deseja excluir o usuário',
    },
    dashboard: {
      welcome: 'Bem-vindo',
      subtitle: 'Aqui está o que está acontecendo hoje no sistema.',
      activeProjects: 'Projetos Ativos',
      monthlyReports: 'Relatórios Mensais',
      pendingTasks: 'Tarefas Pendentes',
      recentActivity: 'Atividades Recentes',
      newEvent: 'Novo Evento',
      actionPerfomed: 'Ação realizada no sistema',
      minutesAgo: 'minutos atrás',
      quickActions: 'Ações Rápidas',
      viewProfile: 'Ver Perfil',
      settings: 'Configurações',
      exportData: 'Exportar Dados',
      auditLog: 'Log de Auditoria',
      notImplemented: 'Funcionalidade em breve!',
      exporting: 'Iniciando exportação de dados...',
    },
    admin: {
      title: 'Painel de Administração',
      subtitle: 'Gerencie usuários e permissões do sistema.',
      addUser: 'Adicionar Usuário',
      searchPlaceholder: 'Buscar por nome ou email...',
      usersFound: 'usuários encontrados',
      noUsers: 'Nenhum usuário encontrado para',
      editUser: 'Editar Usuário',
      newUser: 'Novo Usuário',
      saving: 'Salvando...',
    },
    sidebar: {
      dashboard: 'Dashboard',
      adminAccess: 'Acesso Administrador',
      darkMode: 'Modo Escuro',
      lightMode: 'Modo Claro',
      logout: 'Sair do sistema',
      logoutMobile: 'Sair',
    },
    forbidden: {
      title: 'Acesso Negado',
      message: 'Desculpe, você não tem permissão para acessar esta página. Entre em contato com um administrador se achar que isso é um erro.',
      button: 'Voltar para o Dashboard',
    }
  },
  en: {
    common: {
      email: 'Email',
      password: 'Password',
      name: 'Full Name',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      loading: 'Loading...',
      processing: 'Processing...',
      success: 'Success',
      error: 'Error',
      back: 'Back',
      actions: 'Actions',
      search: 'Search',
      developedBy: 'Developed with',
      by: 'by',
      admin: 'Admin',
      user: 'User',
      viewer: 'Viewer',
      status: 'Status',
      active: 'Active',
      role: 'Role',
    },
    auth: {
      loginTitle: 'Sign in to your account',
      loginButton: 'Sign In',
      verifying: 'Verifying...',
      welcome: 'Welcome!',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      noAccount: 'Don\'t have an account?',
      registerLink: 'Sign up',
      registerTitle: 'Create account',
      joinToday: 'Join GateKeeper today',
      addPhoto: 'Add Photo',
      photoOptional: 'Optional. Max 2MB.',
      passwordStrength: 'Password strength',
      weak: 'Weak',
      medium: 'Medium',
      good: 'Good',
      strong: 'Strong',
      haveAccount: 'Already have an account?',
      loginLink: 'Sign in',
      recoverTitle: 'Recover Password',
      recoverDesc: 'Don\'t worry, it happens! Enter your email below to recover your account.',
      sendLink: 'Send Recovery Link',
      sending: 'Sending...',
      backToLogin: 'Back to Login',
      linkSent: 'We sent a recovery link to your email.',
      accountCreated: 'Account created successfully! Redirecting...',
      testAccounts: 'Test Accounts',
    },
    errors: {
      invalidCredentials: 'Invalid credentials. Try admin@test.com / password',
      emailInUse: 'This email is already in use.',
      emailNotFound: 'Email not found in the system.',
      genericLogin: 'Error logging in',
      genericRegister: 'Error registering',
      genericSave: 'Error saving user',
      selfDelete: 'You cannot delete yourself.',
      deleteConfirm: 'Are you sure you want to delete user',
    },
    dashboard: {
      welcome: 'Welcome',
      subtitle: 'Here is what\'s happening today in the system.',
      activeProjects: 'Active Projects',
      monthlyReports: 'Monthly Reports',
      pendingTasks: 'Pending Tasks',
      recentActivity: 'Recent Activities',
      newEvent: 'New Event',
      actionPerfomed: 'Action performed in system',
      minutesAgo: 'minutes ago',
      quickActions: 'Quick Actions',
      viewProfile: 'View Profile',
      settings: 'Settings',
      exportData: 'Export Data',
      auditLog: 'Audit Log',
      notImplemented: 'Feature coming soon!',
      exporting: 'Starting data export...',
    },
    admin: {
      title: 'Admin Panel',
      subtitle: 'Manage users and system permissions.',
      addUser: 'Add User',
      searchPlaceholder: 'Search by name or email...',
      usersFound: 'users found',
      noUsers: 'No users found for',
      editUser: 'Edit User',
      newUser: 'New User',
      saving: 'Saving...',
    },
    sidebar: {
      dashboard: 'Dashboard',
      adminAccess: 'Admin Access',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      logout: 'Sign out',
      logoutMobile: 'Logout',
    },
    forbidden: {
      title: 'Access Denied',
      message: 'Sorry, you do not have permission to access this page. Contact an administrator if you believe this is an error.',
      button: 'Back to Dashboard',
    }
  },
  es: {
    common: {
      email: 'Correo',
      password: 'Contraseña',
      name: 'Nombre Completo',
      save: 'Guardar',
      cancel: 'Cancelar',
      edit: 'Editar',
      delete: 'Eliminar',
      loading: 'Cargando...',
      processing: 'Procesando...',
      success: 'Éxito',
      error: 'Error',
      back: 'Volver',
      actions: 'Acciones',
      search: 'Buscar',
      developedBy: 'Desarrollado con',
      by: 'por',
      admin: 'Admin',
      user: 'Usuario',
      viewer: 'Espectador',
      status: 'Estado',
      active: 'Activo',
      role: 'Rol',
    },
    auth: {
      loginTitle: 'Inicia sesión en tu cuenta',
      loginButton: 'Entrar',
      verifying: 'Verificando...',
      welcome: '¡Bienvenido!',
      rememberMe: 'Recordarme',
      forgotPassword: '¿Olvidaste tu contraseña?',
      noAccount: '¿No tienes una cuenta?',
      registerLink: 'Regístrate',
      registerTitle: 'Crear cuenta',
      joinToday: 'Únete a GateKeeper hoy',
      addPhoto: 'Añadir Foto',
      photoOptional: 'Opcional. Max 2MB.',
      passwordStrength: 'Fortaleza de contraseña',
      weak: 'Débil',
      medium: 'Media',
      good: 'Buena',
      strong: 'Fuerte',
      haveAccount: '¿Ya tienes una cuenta?',
      loginLink: 'Inicia sesión',
      recoverTitle: 'Recuperar Contraseña',
      recoverDesc: '¡No te preocupes, sucede! Ingresa tu correo abajo para recuperar tu cuenta.',
      sendLink: 'Enviar Enlace de Recuperación',
      sending: 'Enviando...',
      backToLogin: 'Volver al Inicio',
      linkSent: 'Enviamos un enlace de recuperación a tu correo.',
      accountCreated: '¡Cuenta creada con éxito! Redirigiendo...',
      testAccounts: 'Cuentas de Prueba',
    },
    errors: {
      invalidCredentials: 'Credenciales inválidas. Prueba admin@test.com / password',
      emailInUse: 'Este correo ya está en uso.',
      emailNotFound: 'Correo no encontrado en el sistema.',
      genericLogin: 'Error al iniciar sesión',
      genericRegister: 'Error al registrarse',
      genericSave: 'Error al guardar usuario',
      selfDelete: 'No puedes eliminarte a ti mismo.',
      deleteConfirm: '¿Estás seguro de que deseas eliminar al usuario',
    },
    dashboard: {
      welcome: 'Bienvenido',
      subtitle: 'Esto es lo que está pasando hoy en el sistema.',
      activeProjects: 'Proyectos Activos',
      monthlyReports: 'Reportes Mensuales',
      pendingTasks: 'Tareas Pendientes',
      recentActivity: 'Actividades Recientes',
      newEvent: 'Nuevo Evento',
      actionPerfomed: 'Acción realizada en el sistema',
      minutesAgo: 'minutos atrás',
      quickActions: 'Acciones Rápidas',
      viewProfile: 'Ver Perfil',
      settings: 'Configuración',
      exportData: 'Exportar Datos',
      auditLog: 'Registro de Auditoría',
      notImplemented: '¡Funcionalidad pronto!',
      exporting: 'Iniciando exportación de datos...',
    },
    admin: {
      title: 'Panel de Administración',
      subtitle: 'Administra usuarios y permisos del sistema.',
      addUser: 'Añadir Usuario',
      searchPlaceholder: 'Buscar por nombre o correo...',
      usersFound: 'usuarios encontrados',
      noUsers: 'Ningún usuario encontrado para',
      editUser: 'Editar Usuario',
      newUser: 'Nuevo Usuario',
      saving: 'Guardando...',
    },
    sidebar: {
      dashboard: 'Tablero',
      adminAccess: 'Acceso Admin',
      darkMode: 'Modo Oscuro',
      lightMode: 'Modo Claro',
      logout: 'Cerrar Sesión',
      logoutMobile: 'Salir',
    },
    forbidden: {
      title: 'Acceso Denegado',
      message: 'Lo sentimos, no tienes permiso para acceder a esta página. Contacta a un administrador si crees que es un error.',
      button: 'Volver al Tablero',
    }
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicializa o idioma a partir do LocalStorage ou usa 'pt' como padrão
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'pt';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  /**
   * Função de Tradução (Helper 't')
   * Aceita strings no formato "namespace.chave" (ex: "auth.loginButton").
   * Navega recursivamente pelo objeto de traduções para encontrar o valor.
   */
  const t = (path: string): string => {
    const keys = path.split('.');
    let current: any = translations[language];
    
    for (const key of keys) {
      if (current[key] === undefined) {
        // Fallback: Retorna a própria chave se não encontrar a tradução
        console.warn(`Translation missing for key: ${path} in language: ${language}`);
        return path;
      }
      current = current[key];
    }
    
    return current as string;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
