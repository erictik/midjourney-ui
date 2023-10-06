export interface AuthContextType {
  user: any;
  login: () => void;
  logout: () => void;
  authReady: boolean;
  type: string;
  loginWithCode?: (code: string) => void;
}

export interface User {
  user_metadata: {
    full_name?: string;
  } | null;
}