import NetlifyAuthContext, { NetlifyAuthContextProvider } from "./netlifyAuthContext";
import NoAuthContext, { NoAuthContextProvider } from "./noAuthContext";
import CodeAuthContext, { CodeAuthContextProvider } from "./codeAuthContext";

let AuthContext = NoAuthContext;
let AuthContextProvider = NoAuthContextProvider;
if (process.env.NEXT_PUBLIC_AUTH_PROVIDER === "netlify") {
  AuthContext = NetlifyAuthContext;
  AuthContextProvider = NetlifyAuthContextProvider;
}
switch (process.env.NEXT_PUBLIC_AUTH_PROVIDER) {
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