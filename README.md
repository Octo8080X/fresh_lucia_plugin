# fresh-lucia-plugin

Lucia plugin for Fresh(Deno)

# Usage

## Basic

```ts
// fresh.config.ts
import { defineConfig } from "$fresh/server.ts";
import twindPlugin from "$fresh/plugins/twind.ts";
import twindConfig from "./twind.config.ts";
import { getLuciaPlugin } from "./fresh-lucia-plugin/mod.ts";
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
- Logon route component

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
