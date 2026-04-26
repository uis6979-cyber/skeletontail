import { api } from "@/services/api";

export const useAuth = () => {
  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    return res.data;
  };

  const register = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("user");
      localStorage.removeItem("remember_me");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return { login, register, logout };
};