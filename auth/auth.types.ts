
import { User } from '../types/user';

export interface LoginResponse {
  user: User;
  token: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string, avatar?: File) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  logout: () => void;
}
