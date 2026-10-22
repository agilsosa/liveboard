import { createFactory } from "hono/factory";
import createAuth from "./auth.ts";
import type createDatabaseClient from "../db/index.ts";

type Auth = ReturnType<typeof createAuth>;

export interface HonoEnv {
  Variables: {
    auth: Auth;
    db: ReturnType<typeof createDatabaseClient>;
    user: Auth["$Infer"]["Session"]["user"] | null;
    session: Auth["$Infer"]["Session"]["session"] | null;
  };
  Bindings: Env;
}

const factory = createFactory<HonoEnv>();

export default factory;
