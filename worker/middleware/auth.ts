import factory from "../lib/factory.ts";
import { UnauthorizedError } from "../lib/error.ts";

const authMiddleware = factory.createMiddleware(async (c, next) => {
  const user = c.get("user");

  if (!user) {
    throw new UnauthorizedError();
  }

  await next();
});

export default authMiddleware;
