import type {
  AppProps,
  Auth,
  ComponentType,
  Handlers,
  PageProps,
  Plugin,
} from "./deps.ts";
import { getLuciaMiddlewareHandler } from "./middlewares/lucia_middleware.ts";
import Login, { getLoginHandler } from "./routes/login.tsx";
import Logon, { getLogonHandler } from "./routes/logon.tsx";
import { getLogoutHandler } from "./routes/logout.tsx";

export interface LuciaPluginOption {
  customLogin?: {
    path?: string;
    component?: ComponentType<PageProps> | ComponentType<AppProps>;
    handler?: Handlers;
  };
  customLogon?: {
    path?: string;
    component?: ComponentType<PageProps> | ComponentType<AppProps>;
    handler?: Handlers;
  };
  customLogout?: { path?: string; handler?: Handlers };
  nonAuthPaths?: string[];
  customLoginAfterPath?: string;
  customLogoutAfterPath?: string;
  customUsernameValidate?: (
    username: string,
  ) => { status: boolean; errors: string[] };
  customPasswordValidate?: (
    password: string,
  ) => { status: boolean; errors: string[] };
}

export function getLuciaPlugin(
  auth: Auth,
  option?: LuciaPluginOption,
): Plugin {
  const loginAfterPath = option?.customLoginAfterPath || "/";
  const logoutAfterPath = option?.customLogoutAfterPath || "/login";

  const defaultLoginRoute = {
    path: "/login",
    component: Login,
    handler: getLoginHandler(auth, loginAfterPath),
  };
  const loginRoute = option?.customLogin
    ? { ...defaultLoginRoute, ...(option.customLogin) }
    : defaultLoginRoute;

  const defaultLogonRoute = {
    path: "/logon",
    component: Logon,
    handler: getLogonHandler(auth, loginAfterPath),
  };
  const logonRoute = option?.customLogout
    ? { ...defaultLogonRoute, ...(option.customLogon) }
    : defaultLogonRoute;

  const defaultLogoutRoute = {
    path: "/logout",
    handler: getLogoutHandler(auth, logoutAfterPath),
  };
  const logoutRoute = option?.customLogout
    ? { ...defaultLogoutRoute, ...(option.customLogout) }
    : defaultLogoutRoute;

  const other = option?.nonAuthPaths || [];

  return {
    name: "LuciaPlugin",
    middlewares: [
      {
        middleware: {
          handler: getLuciaMiddlewareHandler(auth, {
            login: loginRoute.path,
            logon: logonRoute.path,
            other,
          }),
        },
        path: "/",
      },
    ],
    routes: [
      loginRoute,
      logonRoute,
      logoutRoute,
    ],
  };
}
