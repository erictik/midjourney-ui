import React, { createContext, useState, ReactNode } from "react";
import { AuthContextType, User } from "./authContextType";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();


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
  const [authReady] = useState(true);

  const login = (code: string) => {
    if (code && code === publicRuntimeConfig.NEXT_PUBLIC_AUTH_CODE) {
      setUser({
        user_metadata: { full_name: publicRuntimeConfig.NEXT_PUBLIC_AUTH_NAME || "Eric" },
      })
    }
  };

  const logout = () => {
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
