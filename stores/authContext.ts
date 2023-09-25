import NetlifyAuthContext, { NetlifyAuthContextProvider } from "./netlifyAuthContext";
import NoAuthContext, {NoAuthContextProvider} from "./noAuthContext";

let AuthContext = NoAuthContext;
let AuthContextProvider = NoAuthContextProvider;
if (process.env.NEXT_PUBLIC_AUTH_PROVIDER === "netlify") {
  AuthContext = NetlifyAuthContext;
  AuthContextProvider = NetlifyAuthContextProvider;
}

export {AuthContextProvider};
export default AuthContext;