export interface Container {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error';
  image: string;
  url: string;
  createdAt: string;
  ports: string[];
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}