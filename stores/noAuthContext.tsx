import React, { createContext, useState, ReactNode } from "react";
import { AuthContextType, User } from "./authContextType";


const NoAuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  authReady: false
});

export const NoAuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user] = useState<User | null>({user_metadata: {full_name: "Eric"}});
  const [authReady] = useState(true);

  const login = () => {};

  const logout = () => {};

  const contextValue: AuthContextType = {
    user,
    login,
    logout,
    authReady
  };

  return <NoAuthContext.Provider value={contextValue} >{children}</NoAuthContext.Provider>;
};

export default NoAuthContext;
