import factory from "../lib/factory.ts";

export const sessionMiddleware = factory.createMiddleware(async (c, next) => {
  const session = await c.get("auth").api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    await next();
    return;
  }

  c.set("user", session.user);
  c.set("session", session.session);
  await next();
});
