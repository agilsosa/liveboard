import createDatabaseClient from "./db/index.ts";
import { sql } from "drizzle-orm";
import createAuth from "./lib/auth.ts";
import factory from "./lib/factory.ts";
import { sessionMiddleware } from "./middleware/session.ts";

const app = factory
  .createApp()
  .basePath("/api")
  .use("*", async (c, next) => {
    const db = createDatabaseClient(c.env);
    c.set("db", db);
    c.set("auth", createAuth(db, c.env));

    await next();
  })
  .use("*", sessionMiddleware)
  .on(["POST", "GET"], "/auth/*", (c) => c.get("auth").handler(c.req.raw))
  .get("", async (c) => {
    const db = c.get("db");

    const result = await db.get(sql`SELECT 'Liveboard' as name`);
    console.log(result);
    return c.json(result);
  });

export default app;
