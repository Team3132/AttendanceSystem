import { getTableColumns, or, sql } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";

/**
 * Builds the set columns for the on conflict clause to check to see if the excluded column value is different from the current column value
 *
 * On conflict only updates the entry if any of the columns are different
 *
 * @param table Table to build the columns for
 * @param columns Columns to set
 * @returns SQL object with the columns to set based on exclusions
 */
export const buildSetWhereColumns = <
  T extends PgTable | SQLiteTable,
  Q extends keyof T["_"]["columns"],
>(
  table: T,
  columns: Q[],
) => {
  /** The table columns */
  const cls = getTableColumns(table);

  /** The statements to check if the column is different */
  const statements = columns.map((column) => {
    /** The reference to the column */
    const col = cls[column];
    /** The column name */
    const colName = col.name;
    /** The excluded column as a raw SQL object */
    const excluded = sql.raw(`excluded.${colName}`);

    // Check if the column is different
    return sql`${col} != ${excluded}`;
  });

  // Return the or statement of all the statements
  return or(...statements);
};
