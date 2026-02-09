import { useCallback } from 'react';
import { useAuthStore } from '../store/auth.store';
import { authService } from '../services/auth.service';
import { storage } from '../utils/storage';
import { LoginRequest, RegisterRequest } from '../types/auth.types';

export function useAuth() {
  const { user, isAuthenticated, isLoading, setAuth, clearAuth, setLoading } =
    useAuthStore();

  const login = useCallback(
    async (data: LoginRequest) => {
      const response = await authService.login(data);
      await storage.setToken(response.token);
      setAuth(response.user, response.token);
    },
    [setAuth],
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      const response = await authService.register(data);
      await storage.setToken(response.token);
      setAuth(response.user, response.token);
    },
    [setAuth],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Token may be expired, ignore
    }
    await storage.removeToken();
    clearAuth();
  }, [clearAuth]);

  const checkAuth = useCallback(async () => {
    try {
      const token = await storage.getToken();
      if (!token) {
        clearAuth();
        return;
      }
      const user = await authService.getProfile();
      setAuth(user, token);
    } catch {
      await storage.removeToken();
      clearAuth();
    }
  }, [setAuth, clearAuth]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
  };
}
