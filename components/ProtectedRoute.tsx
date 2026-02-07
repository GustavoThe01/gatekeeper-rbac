
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

/**
 * Componente de Guarda de Rotas (Route Guard).
 * Atua como um "middleware" no frontend.
 * 
 * Fluxo de verificação:
 * 1. Loading: Mostra spinner enquanto verifica sessão.
 * 2. Autenticação: Se não logado -> Redireciona para /login.
 * 3. Autorização: Se logado mas sem Role adequada -> Redireciona para /forbidden.
 * 4. Sucesso: Renderiza a página (children).
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // 1. Estado de Carregamento (Evita piscar tela de login)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 2. Verificação de Autenticação
  if (!isAuthenticated) {
    // Salva a localização atual (from) para redirecionar de volta após login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Verificação de Autorização (RBAC)
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  // 4. Renderização Autorizada
  return <>{children}</>;
};
