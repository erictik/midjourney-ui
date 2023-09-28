export interface AuthContextType {
  user: any;
  login: () => void;
  logout: () => void;
  authReady: boolean;
}

export interface User {
  user_metadata: {
    full_name?: string;
  } | null;
}