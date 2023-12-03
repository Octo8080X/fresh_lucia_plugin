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
import CreateAccount, { getCreateAccountHandler } from "./routes/create_account.tsx";
import { getLogoutHandler } from "./routes/logout.tsx";
import {
  usernameCreateValidate,
  passwordCreateValidate,
  type LuciaPluginUsernameValidate,
  type LuciaPluginPasswordValidate,
} from "./utils/validates.ts";

export interface LuciaPluginOption {
  customLogin?: {
    path?: string;
    component?: ComponentType<PageProps> | ComponentType<AppProps>;
    handler?: Handlers;
  };
  customCreateAccount?: {
    path?: string;
    component?: ComponentType<PageProps> | ComponentType<AppProps>;
    handler?: Handlers;
  };
  customLogout?: { path?: string; handler?: Handlers };
  nonAuthPaths?: string[];
  customLoginAfterPath?: string;
  customLogoutAfterPath?: string;
  customUsernameValidate?: LuciaPluginUsernameValidate,
  customPasswordValidate?: LuciaPluginPasswordValidate
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

  const usernameValidate = option?.customUsernameValidate || usernameCreateValidate;
  const passwordValidate = option?.customPasswordValidate || passwordCreateValidate;

  const defaultCreateAccountRoute = {
    path: "/create_account",
    component: CreateAccount,
    handler: getCreateAccountHandler(auth, loginAfterPath, usernameValidate, passwordValidate),
  };
  const createAccountRoute = option?.customLogout
    ? { ...defaultCreateAccountRoute, ...(option.customCreateAccount) }
    : defaultCreateAccountRoute;

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
            createAccount: createAccountRoute.path,
            other,
          }),
        },
        path: "/",
      },
    ],
    routes: [
      loginRoute,
      createAccountRoute,
      logoutRoute,
    ],
  };
}
