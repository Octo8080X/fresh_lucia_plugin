# fresh-lucia-plugin

Lucia plugin for Fresh(Deno)  
Login functionality (account creation/login/logout) is provided simply by applying the plugin.

> [!CAUTION]
> This repository is archived.
> Successive developments will be taken over by [plantation](https://github.com/Octo8080X/plantation)

# Usage

## Basic

```ts
// fresh.config.ts
import { defineConfig } from "$fresh/server.ts";
import twindPlugin from "$fresh/plugins/twind.ts";
import twindConfig from "./twind.config.ts";
import { getLuciaPlugin } from "https://deno.land/x/fresh_lucia_plugin/mod.ts";
import { auth } from "./utils/lucia.ts"; // auth is lucia instance

export default defineConfig({
  plugins: [
    twindPlugin(twindConfig),
    getLuciaPlugin(auth),
  ],
});
```

## No login required route.

Routes that do not require login can be defined.

```ts
// fresh.config.ts

export default defineConfig({
  plugins: [
    twindPlugin(twindConfig),
    getLuciaPlugin(auth),{ nonAuthPaths: ["/"] }
  ],
});
```

## No login required route.

Can define where to redirect after logging out.

```ts
// fresh.config.ts

export default defineConfig({
  plugins: [
    twindPlugin(twindConfig),
    getLuciaPlugin(auth),{ customLogoutAfterPath: ["/"] }
  ],
});
```

## Custom component

The components of the page can be replaced.

- Login route component
- Create Account route component

```ts
// fresh.config.ts

export default defineConfig({
  plugins: [
    twindPlugin(twindConfig),
    getLuciaPlugin(auth), { customLogin: { component: customLogin, path: "/login" }}
  ],
});
```

## Custom validate

Custom username(password) and password constraints are available.

```ts
// fresh.config.ts

import { getLuciaPlugin, type LuciaPluginTextValidateResult } from "https://deno.land/x/fresh_lucia_plugin@0.0.2/mod.ts";

function usernameValidate(username: string|undefined|null): LuciaPluginTextValidateResult {
  if (!username || username.length < 10) {
    return { success: false, errors: ['Username must be at least 10 characters'] };
  }
  return { success: true, data: username, errors: [] }
}

export default defineConfig({
  plugins: [
    twindPlugin(twindConfig),
    getLuciaPlugin(auth, {
        customUsernameValidate: usernameValidate
      }
    ),
  ],
});
```

# Use session in routes

Session data is contained in context.

```ts
// routes/index.tsx
import { WithSessionHandlerContext } from "../fresh_lucia_plugin/mod.ts";

export default function Home({ state }: WithSessionHandlerContext) {
  return (
    <div class="px-4 py-8 mx-auto bg-[#86efac]">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <p>{state.session ? state.session.user.username : "LO LOGIN"}</p>

        {state.session
          ? <a href="/logout" class="my-4">LOGOUT</a>
          : <a href="/login" class="my-4">LOGIN</a>}
      </div>
    </div>
  );
}

```