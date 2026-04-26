import { api } from "./api";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export const userService = {
  getAll: async (): Promise<User[]> => {
    const res = await api.get("/users");
    return res.data;
  },

  getById: async (id: string): Promise<User> => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  create: async (data: Partial<User>) => {
    const res = await api.post("/users", data);
    return res.data;
  },

  update: async (id: string, data: Partial<User>) => {
    const res = await api.patch(`/users/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },
};