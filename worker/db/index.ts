import { drizzle } from "drizzle-orm/d1";
import { authRelations } from "./schema/auth.ts";
import { classroomRelations } from "./schema/classroom.ts";

const relations = { ...authRelations, ...classroomRelations };

function createDatabaseClient(env: Env) {
  return drizzle(env.DB, { relations });
}

export default createDatabaseClient;
