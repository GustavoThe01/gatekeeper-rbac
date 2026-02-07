
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { AuthContextType } from '../auth/auth.types';

/**
 * Hook Personalizado: useAuth
 * Facilita o acesso ao AuthContext em qualquer componente funcional.
 * Adiciona uma camada de segurança verificando se o componente está dentro do Provider.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
