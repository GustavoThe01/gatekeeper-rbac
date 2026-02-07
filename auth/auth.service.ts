
import { User, UserRole } from '../types/user';
import { LoginResponse } from './auth.types';

/**
 * CONSTANTES DE ARMAZENAMENTO
 * Chaves utilizadas no LocalStorage/SessionStorage para persistir dados.
 * A versão no nome da chave (v2) ajuda a invalidar caches antigos em atualizações.
 */
const USERS_KEY = 'rbac_mock_users_v2'; 
const SESSION_KEY = 'rbac_session_token';
const USER_DATA_KEY = 'rbac_user_data';
const SESSION_EXPIRY_KEY = 'rbac_session_expiry';
const REMEMBER_ME_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 dias

/**
 * Utilitário para converter File para Base64.
 * Essencial para armazenar imagens pequenas diretamente no LocalStorage (Mock).
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Simula um Banco de Dados.
 * Recupera usuários do LocalStorage ou inicializa com dados padrão (seeding).
 */
const getMockUsers = (): any[] => {
  const users = localStorage.getItem(USERS_KEY);
  if (!users) {
    const initialUsers = [
      { 
        id: '1', 
        name: 'Desenvolvedor', 
        email: 'admin@test.com', 
        password: 'password', 
        role: UserRole.ADMIN, 
        avatar: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=150&h=150&q=80' 
      },
      { 
        id: '2', 
        name: 'Joao Freitas', 
        email: 'user@test.com', 
        password: 'password', 
        role: UserRole.USER, 
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80' 
      },
      { 
        id: '3', 
        name: 'Maria Alencar', 
        email: 'viewer@test.com', 
        password: 'password', 
        role: UserRole.VIEWER, 
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80' 
      },
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
    return initialUsers;
  }
  return JSON.parse(users);
};

/**
 * AUTH SERVICE (MOCK)
 * Simula todas as chamadas assíncronas que seriam feitas para uma API real (Node/Python).
 * Utiliza 'setTimeout' para criar latência artificial e mostrar estados de 'loading'.
 */
export const authService = {
  
  /**
   * Realiza o login do usuário.
   * Verifica credenciais e cria sessão (persistente ou de aba).
   */
  login: async (email: string, password: string, rememberMe: boolean = false): Promise<LoginResponse> => {
    // 1. Simula delay de rede (800ms)
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 2. Busca usuário no "banco"
    const users = getMockUsers();
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (!user) {
      // Retorna uma chave de erro para ser traduzida no front
      throw new Error('errors.invalidCredentials');
    }

    // 3. Gera token fake e prepara objeto do usuário
    const token = `mock-jwt-token-${btoa(user.email)}-${Date.now()}`;
    const userData: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
    };

    // 4. Limpa sessões antigas para evitar conflitos
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem(SESSION_EXPIRY_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(USER_DATA_KEY);

    // 5. Persistência condicional (Lembrar-me)
    if (rememberMe) {
      const expiryTime = Date.now() + REMEMBER_ME_DURATION;
      localStorage.setItem(SESSION_KEY, token);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
      localStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toString());
    } else {
      sessionStorage.setItem(SESSION_KEY, token);
      sessionStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    }

    return { user: userData, token };
  },

  /**
   * Registra um novo usuário.
   */
  register: async (name: string, email: string, password: string, avatar?: File): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = getMockUsers();
    if (users.find((u: any) => u.email === email)) {
      throw new Error('errors.emailInUse');
    }

    let avatarUrl = undefined;
    if (avatar) {
      try {
        avatarUrl = await fileToBase64(avatar);
      } catch (e) {
        console.error("Erro ao converter avatar", e);
      }
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password,
      role: UserRole.USER, // Todo registro público inicia como USER
      avatar: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  /**
   * Simula envio de email de recuperação.
   */
  requestPasswordReset: async (email: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const users = getMockUsers();
    const user = users.find((u: any) => u.email === email);
    
    if (!user) {
      throw new Error('errors.emailNotFound');
    }
    console.log(`[MOCK] Email de recuperação enviado para: ${email}`);
  },

  /**
   * Limpa todos os dados de sessão.
   */
  logout: () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem(SESSION_EXPIRY_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(USER_DATA_KEY);
  },

  /**
   * Verifica se existe uma sessão ativa ao recarregar a página.
   * Lida com SessionStorage (aba) e LocalStorage (persistente com expiração).
   */
  getCurrentSession: (): { user: User | null; token: string | null } => {
    // 1. Checa Session Storage (Prioritário, sessão curta)
    let token = sessionStorage.getItem(SESSION_KEY);
    let userData = sessionStorage.getItem(USER_DATA_KEY);

    if (token && userData) {
      return { token, user: JSON.parse(userData) };
    }

    // 2. Checa Local Storage (Persistente)
    token = localStorage.getItem(SESSION_KEY);
    userData = localStorage.getItem(USER_DATA_KEY);
    const expiry = localStorage.getItem(SESSION_EXPIRY_KEY);

    if (token && userData) {
      // Verifica validade do token
      if (expiry) {
        const expiryTime = parseInt(expiry, 10);
        if (Date.now() > expiryTime) {
          authService.logout(); // Token expirado, limpa tudo
          return { token: null, user: null };
        }
      }
      return { token, user: JSON.parse(userData) };
    }
    
    return { token: null, user: null };
  },

  // --- MÉTODOS DE ADMINISTRAÇÃO (CRUD) ---

  getAllUsers: async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return getMockUsers();
  },

  deleteUser: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = getMockUsers().filter((u: any) => u.id !== id);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  updateUser: async (id: string, data: Partial<User>): Promise<void> => {
     await new Promise(resolve => setTimeout(resolve, 500));
     const users = getMockUsers();
     const index = users.findIndex((u: any) => u.id === id);
     if (index !== -1) {
       users[index] = { ...users[index], ...data };
       localStorage.setItem(USERS_KEY, JSON.stringify(users));
     }
  },
  
  createUser: async (data: any): Promise<void> => {
     await new Promise(resolve => setTimeout(resolve, 500));
     const users = getMockUsers();
     if (users.find((u: any) => u.email === data.email)) {
        throw new Error('errors.emailInUse');
     }
     
     const avatarUrl = data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`;

     const newUser = {
       id: Math.random().toString(36).substr(2, 9),
       password: 'password', // Senha padrão para usuários criados pelo admin
       ...data,
       avatar: avatarUrl
     };
     users.push(newUser);
     localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
};
