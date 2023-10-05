import React, { createContext, useState, ReactNode } from "react";
import { AuthContextType, User } from "./authContextType";

const CodeAuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  loginWithCode: () => {},
  logout: () => {},
  authReady: false,
  type: "code",
});

export const CodeAuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const login = (code: string) => {
    if (code && code === process.env.NEXT_PUBLIC_AUTH_CODE) {
      setAuthReady(true);
      setUser({
        user_metadata: { full_name: process.env.NEXT_PUBLIC_AUTH_NAME || "Eric" },
      })
    }
  };

  const logout = () => {
    setAuthReady(true);
    setUser(null);
  }

  const contextValue: AuthContextType = {
    user,
    login: () => {},
    loginWithCode: login,
    logout,
    authReady,
    type: "code",
  };

  return (
    <CodeAuthContext.Provider value={contextValue}>
      {children}
    </CodeAuthContext.Provider>
  );
};

export default CodeAuthContext;
