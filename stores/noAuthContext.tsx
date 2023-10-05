import React, { createContext, useState, ReactNode } from "react";
import { AuthContextType, User } from "./authContextType";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();


const NoAuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  authReady: false,
  type: "no",
});

export const NoAuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user] = useState<User | null>({user_metadata: {full_name: publicRuntimeConfig.NEXT_PUBLIC_AUTH_NAME || "Eric"}});
  const [authReady] = useState(true);

  const login = () => {};

  const logout = () => {};

  const contextValue: AuthContextType = {
    user,
    login,
    logout,
    authReady,
    type: "no",
  };

  return <NoAuthContext.Provider value={contextValue} >{children}</NoAuthContext.Provider>;
};

export default NoAuthContext;
