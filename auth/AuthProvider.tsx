
import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { User, AuthState } from '../types/user';
import { authService } from './auth.service';

/**
 * Provider que envolve a aplicação para gerenciar o estado global de autenticação.
 * Responsável por inicializar a sessão, login, registro e logout.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado inicial
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true, // Inicia carregando para verificar sessão existente
  });

  /**
   * Efeito: Restauração de Sessão
   * Ao carregar a página (F5), verifica se há credenciais salvas no Storage.
   */
  useEffect(() => {
    const { user, token } = authService.getCurrentSession();
    if (user && token) {
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      // Se não houver sessão, apenas finaliza o loading
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  /**
   * Função de Login
   * Chama o serviço e atualiza o estado global.
   */
  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const { user, token } = await authService.login(email, password, rememberMe);
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      throw error; // Propaga erro para ser tratado na UI (Ex: componente Login)
    }
  };

  /**
   * Função de Registro
   * Apenas chama o serviço, sem logar automaticamente (design choice).
   */
  const register = async (name: string, email: string, password: string, avatar?: File) => {
    try {
      await authService.register(name, email, password, avatar);
    } catch (error) {
      throw error;
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      await authService.requestPasswordReset(email);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Função de Logout
   * Limpa storage e reseta o estado. 
   * 'useCallback' previne recriação desnecessária da função.
   */
  const logout = useCallback(() => {
    authService.logout();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, requestPasswordReset, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
