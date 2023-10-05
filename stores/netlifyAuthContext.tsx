import React, { createContext, useState, useEffect, ReactNode } from "react";
import netlifyIdentity from "netlify-identity-widget";
import { AuthContextType } from "./authContextType";


const NetlifyAuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  authReady: false,
  type: "netlify",
});

export const NetlifyAuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<netlifyIdentity.User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const handleLogin = (user: netlifyIdentity.User) => {
      setUser(user);
      netlifyIdentity.close();
    };

    const handleLogout = () => {
      setUser(null);
    };

    const handleInit = (user: netlifyIdentity.User | null) => {
      setUser(user);
      setAuthReady(true);
    };

    netlifyIdentity.on("login", handleLogin);
    netlifyIdentity.on("logout", handleLogout);
    netlifyIdentity.on("init", handleInit);

    // init netlify identity connection
    netlifyIdentity.init();

    return () => {
      netlifyIdentity.off("login", handleLogin);
      netlifyIdentity.off("logout", handleLogout);
    };
  }, []);

  const login = () => {
    netlifyIdentity.open();
  };

  const logout = () => {
    netlifyIdentity.logout();
  };

  const contextValue: AuthContextType = {
    user,
    login,
    logout,
    authReady,
    type: "netlify",
  };

  return <NetlifyAuthContext.Provider value={contextValue} >{children}</NetlifyAuthContext.Provider>;
};

export default NetlifyAuthContext;
