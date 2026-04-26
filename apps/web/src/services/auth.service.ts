import { api } from "./api";

export interface RegisterDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  password: string;
  confirmPassword: string;
}

/**
 * Auth Service
 * 
 * Orchestrates all identity and session-related API interactions.
 * Decouples network logic from hooks and components.
 */
export const authService = {
  register: async (data: RegisterDTO) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  login: async (data: any) => {
    const res = await api.post("/auth/login", data, {
      withCredentials: true, // 🔥 CLAVE
    });
    return res.data;
  },

  logout: async () => {
    const res = await api.post("/auth/logout", {}, {
      withCredentials: true,
    });
    return res.data;
  },

  me: async () => {
    const res = await api.get("/auth/me", {
      withCredentials: true,
    });
    return res.data;
  },

  forgotPassword: async (data: ForgotPasswordDTO) => {
    const res = await api.post("/auth/forgot-password", data);
    return res.data;
  },

  resetPassword: async (data: ResetPasswordDTO) => {
    const res = await api.post("/auth/reset-password", data);
    return res.data;
  }
};