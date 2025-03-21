
export interface User {
  id: string;
  name: string;
  email: string;
  isAuthenticated: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
}
