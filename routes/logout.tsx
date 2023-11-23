import { Auth, HandlerContext, Handlers } from "../deps.ts";

export function getLogoutHandler(
  auth: Auth,
  logoutAfterPath: string,
): Handlers {
  return {
    async GET(req: Request, ctx: HandlerContext) {
      const authRequest = auth.handleRequest(req);
      const session = await authRequest.validate();
      if (session) {
        auth.invalidateSession(session.sessionId);
        return new Response("Unauthorized", {
          status: 302,
          headers: { "Location": logoutAfterPath },
        });
      } else {
        return new Response("Unauthorized", {
          status: 302,
          headers: { "Location": req.referrer || "/" },
        });
      }
    },
  };
}
