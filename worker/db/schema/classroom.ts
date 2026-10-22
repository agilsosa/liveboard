import { defineRelationsPart } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { user } from "./auth.js";

export const classroom = sqliteTable(
  "classroom",
  {
    id: text("id").primaryKey(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    code: text("code").notNull().unique(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [
    index("classroom_expires_idx").on(t.expiresAt),
    index("classroom_owner_idx").on(t.ownerId),
  ],
);

export const roster = sqliteTable("roster", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("label").notNull(),
});

export const rosterEntry = sqliteTable(
  "roster_entry",
  {
    id: text("id").primaryKey(),
    rosterId: text("roster_id")
      .notNull()
      .references(() => roster.id, { onDelete: "cascade" }),
    identifier: text("identifier").notNull(),
    label: text("label").notNull(),
    claimedByUserId: text("claimed_by_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
  },
  (t) => [uniqueIndex("roster_label_unique").on(t.rosterId, t.label)],
);

export const upload = sqliteTable(
  "upload",
  {
    id: text("id").primaryKey(),
    classroomId: text("classroom_id")
      .notNull()
      .references(() => classroom.id, { onDelete: "cascade" }),
    rosterEntryId: text("roster_entry_id").references(() => rosterEntry.id, {
      onDelete: "set null",
    }),
    uploaderUserId: text("uploader_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    kind: text("kind", { enum: ["text", "file"] }).notNull(),
    textBody: text("text_body"),
    r2Key: text("r2_key"),
    fileName: text("file_name"),
    mimeType: text("mime_type"),
    sizeBytes: integer("size_bytes").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [index("upload_classroom_idx").on(t.classroomId)],
);

export const classroomRelations = defineRelationsPart(
  { classroom, roster, rosterEntry, upload, user },
  (r) => ({
    classroom: {
      owner: r.one.user({
        from: r.classroom.ownerId,
        to: r.user.id,
      }),
      uploads: r.many.upload({
        from: r.classroom.id,
        to: r.upload.classroomId,
      }),
    },
    roster: {
      owner: r.one.user({
        from: r.roster.userId,
        to: r.user.id,
      }),
      entries: r.many.rosterEntry({
        from: r.roster.id,
        to: r.rosterEntry.rosterId,
      }),
    },
    rosterEntry: {
      roster: r.one.roster({
        from: r.rosterEntry.rosterId,
        to: r.roster.id,
      }),
      claimedBy: r.one.user({
        from: r.rosterEntry.claimedByUserId,
        to: r.user.id,
      }),
      uploads: r.many.upload({
        from: r.rosterEntry.id,
        to: r.upload.rosterEntryId,
      }),
    },
    upload: {
      classroom: r.one.classroom({
        from: r.upload.classroomId,
        to: r.classroom.id,
      }),
      rosterEntry: r.one.rosterEntry({
        from: r.upload.rosterEntryId,
        to: r.rosterEntry.id,
      }),
      uploader: r.one.user({
        from: r.upload.uploaderUserId,
        to: r.user.id,
      }),
    },
    user: {
      classrooms: r.many.classroom({
        from: r.user.id,
        to: r.classroom.ownerId,
      }),
      rosters: r.many.roster({
        from: r.user.id,
        to: r.roster.userId,
      }),
      claimedRosterEntries: r.many.rosterEntry({
        from: r.user.id,
        to: r.rosterEntry.claimedByUserId,
      }),
      uploads: r.many.upload({
        from: r.user.id,
        to: r.upload.uploaderUserId,
      }),
    },
  }),
);
