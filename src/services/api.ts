import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    return data;
  },
  register: async (email: string, password: string) => {
    const { data } = await api.post('/auth/register', { email, password });
    localStorage.setItem('token', data.token);
    return data;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
};

export const containers = {
  create: async (containerData: {
    name: string;
    image: string;
    dockerfile?: string;
    customUrl?: string;
    ports?: string[];
  }) => {
    const { data } = await api.post('/containers', containerData);
    return data;
  },
  start: async (id: string) => {
    const { data } = await api.post(`/containers/${id}/start`);
    return data;
  },
  stop: async (id: string) => {
    const { data } = await api.post(`/containers/${id}/stop`);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/containers/${id}`);
  },
};