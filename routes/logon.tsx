import { Auth, HandlerContext, Handlers, LuciaError } from "../deps.ts";
import { PASSWORD_KEY, USERNAME_KEY } from "../utils/consts.ts";
import { styles } from "../utils/style.ts";
import { LuciaPluginPasswordValidate, LuciaPluginUsernameValidate } from "../utils/validates.ts";

export function getLogonHandler(
  auth: Auth,
  loginAfterPath: string,
  usernameValidate: LuciaPluginUsernameValidate,
  passwordValidate: LuciaPluginPasswordValidate,
): Handlers {
  return {
    async POST(req: Request, ctx: HandlerContext) {
      const formData = await req.formData();
      const username = formData.get(USERNAME_KEY);
      const password = formData.get(PASSWORD_KEY);
      const usernameResult = usernameValidate(username?.toString());
      const passwordResult = passwordValidate(password?.toString());

      if (!(usernameResult.success && passwordResult.success)) {
        return ctx.render({
          errors: [...usernameResult.errors, ...passwordResult.errors],
          username,
        });
      }

      try {
        const user = await auth.createUser({
          key: {
            providerId: USERNAME_KEY,
            providerUserId: usernameResult.data,
            password: passwordResult.data,
          },
          attributes: {
            username: usernameResult.data,
          },
        });
        const session = await auth.createSession({
          userId: user.userId,
          attributes: {},
        });
        const sessionCookie = auth.createSessionCookie(session);

        return new Response(null, {
          headers: {
            Location: loginAfterPath,
            "Set-Cookie": sessionCookie.serialize(), // store session cookie
          },
          status: 302,
        });
      } catch (e) {
        console.error("e", e);
        if (e instanceof LuciaError) {
          return ctx.render({
            errors: ["Auth system error"],
            username,
          });
        }
        return new Response("An unknown error occurred", {
          status: 500,
        });
      }
    },
  };
}

interface LogonComponentProps {
  data: {
    errors: string[];
    username?: string;
  };
}

export default function Logon({ data }: LogonComponentProps) {
  return (
    <div style={styles.block}>
      <div>
        <h2>Create Account</h2>
      </div>
      <div>
        <form action="/logon" method="post">
          <div style={styles.row}>
            {data?.errors?.length > 0 && (
              <ul>
                {data.errors.map((error) => <li>{error}</li>)}
              </ul>
            )}
          </div>
          <div style={styles.row}>
            <label for="username" style={styles.label}>Username</label>
            <input
              type="text"
              id="username"
              name="username"
              style={styles.textbox}
              value={data?.username}
            />
          </div>
          <div style={styles.row}>
            <label for="password" style={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              style={styles.textbox}
            />
          </div>
          <div style={styles.row}>
            <button type="submit" style={styles.button}>Login</button>
          </div>
        </form>
      </div>
      <div>
        <a href="/login" style={styles.link}>LOGIN</a>
      </div>
    </div>
  );
}
