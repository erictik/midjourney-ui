import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import NetlifyAuthContext, { NetlifyAuthContextProvider } from "./netlifyAuthContext";
import NoAuthContext, { NoAuthContextProvider } from "./noAuthContext";
import CodeAuthContext, { CodeAuthContextProvider } from "./codeAuthContext";

let AuthContext = NoAuthContext;
let AuthContextProvider = NoAuthContextProvider;
switch (publicRuntimeConfig.NEXT_PUBLIC_AUTH_PROVIDER) {
  case "netlify":
    AuthContext = NetlifyAuthContext;
    AuthContextProvider = NetlifyAuthContextProvider;
    break;
  case "code":
    AuthContext = CodeAuthContext;
    AuthContextProvider = CodeAuthContextProvider;
    break;
}

export { AuthContextProvider };
export default AuthContext;