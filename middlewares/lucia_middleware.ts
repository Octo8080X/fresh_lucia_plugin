import {
  Auth,
  type HandlerContext,
  type MiddlewareHandlerContext,
  type Session,
} from "../deps.ts";
export type WithSession = { state: { session?: Session } };
export type WithSessionHandlerContext = HandlerContext & WithSession;
export type WithSessionMiddlewareHandlerContext =
  & MiddlewareHandlerContext
  & WithSession;

export function getLuciaMiddlewareHandler(
  auth: Auth,
  path: { login: string; createAccount: string; other: string[] },
) {
  return async function (
    req: Request,
    ctx: MiddlewareHandlerContext,
  ) {
    const pathname = new URL(req.url).pathname;

    const authRequest = auth.handleRequest(req);
    const session = await authRequest.validate();

    if (
      ctx.destination == "route" &&
      ![path.login, path.createAccount, ...path.other].includes(pathname) &&
      !session
    ) {
      return new Response("Unauthorized", {
        status: 302,
        headers: { "Location": path.login },
      });
    }
    if (ctx.destination == "route" && session) {
      ctx.state.session = session;
    }
    return await ctx.next();
  };
}
