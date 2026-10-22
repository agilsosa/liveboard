import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { anonymous } from "better-auth/plugins";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "../db/schema/auth.ts";

function createAuth(db: DrizzleD1Database, env: Env) {
  const auth = betterAuth({
    baseURL: env.ORIGIN_URL,
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, { provider: "sqlite", schema }),
    emailAndPassword: {
      enabled: true,
    },
    rateLimit: {
      enabled: true,
      window: 60,
      max: 100,
    },
    plugins: [
      anonymous({
        disableDeleteAnonymousUser: true,
      }),
    ],
  });

  return auth;
}

export default createAuth;
