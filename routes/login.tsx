import { Auth, HandlerContext, Handlers, LuciaError } from "../deps.ts";
import { PASSWORD_KEY, USERNAME_KEY } from "../utils/consts.ts";
import { styles } from "../utils/style.ts";
import { passwordValidate, usernameValidate } from "../utils/validates.ts";
export function getLoginHandler(auth: Auth, loginAfterPath: string): Handlers {
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
        const key = await auth.useKey(
          USERNAME_KEY,
          usernameResult.data,
          passwordResult.data,
        );
        const session = await auth.createSession({
          userId: key.userId,
          attributes: {
          },
        });
        const sessionCookie = auth.createSessionCookie(session);
        return new Response(null, {
          headers: {
            Location: loginAfterPath, // redirect to profile page
            "Set-Cookie": sessionCookie.serialize(), // store session cookie
          },
          status: 302,
        });
      } catch (e) {
        console.error("e", e);
        if (
          e instanceof LuciaError &&
          ["AUTH_INVALID_KEY_ID", "AUTH_INVALID_PASSWORD"].includes(e.message)
        ) {
          return ctx.render({
            errors: ["Incorrect username or password"],
            username,
          });
        }
        throw new LuciaError("AUTH_INVALID_KEY_ID");
      }
    },
  };
}

interface LoginComponentProps {
  data: {
    errors: string[];
    username?: string;
  };
}

export default function Login({ data }: LoginComponentProps) {
  return (
    <div style={styles.block}>
      <div>
        <h2>LOGIN</h2>
      </div>
      <div>
        <form action="/login" method="post">
          <div style={styles.row}>
            {data?.errors?.length > 0 && (
              <ul>
                {data.errors.map((error) => <li>{error}</li>)}
              </ul>
            )}
          </div>
          <div style={styles.row}>
            <label for="username"  style={styles.label}>Username</label>
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
            <input type="password" id="password" name="password" style={styles.textbox}/>
          </div>
          <div style={styles.row}>
            <button type="submit" style={styles.button}>Login</button>
          </div>
        </form>
      </div>
      <div>
        <a href="/create_account" style={styles.link}>Create Account</a>
      </div>
    </div>
  );
}
