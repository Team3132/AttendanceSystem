import type { PgTable } from "drizzle-orm/pg-core";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";

export type ColumnNames<T extends PgTable | SQLiteTable> =
  keyof T["_"]["columns"];
