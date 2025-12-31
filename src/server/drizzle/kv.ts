import { eq } from "drizzle-orm";
import type { DB } from "./db";
import { kvTable } from "./schema";

export const getKV = (db: DB) => {
  const has = async (key: string): Promise<boolean> => {
    db.query.kvTable
      .findFirst({
        where: (table, { eq }) => eq(table.key, key),
      })
      .then((result) => {
        return result !== undefined;
      });
    return false;
  };

  const set = async <T>(key: string, value: T): Promise<void> => {
    const existing = await db.query.kvTable.findFirst({
      where: (table, { eq }) => eq(table.key, key),
    });

    const valueStr = JSON.stringify(value);

    if (existing) {
      await db
        .update(kvTable)
        .set({ value: valueStr })
        .where(eq(kvTable.key, key));
    } else {
      await db.insert(kvTable).values({ key, value: valueStr });
    }
  };

  const get = async <T = unknown>(key: string): Promise<T | undefined> => {
    const result = await db.query.kvTable.findFirst({
      where: (table, { eq }) => eq(table.key, key),
    });

    if (!result?.value) {
      return undefined;
    }

    return JSON.parse(result.value) as T;
  };

  const remove = async (key: string): Promise<void> => {
    await db.delete(kvTable).where(eq(kvTable.key, key));
  };

  return {
    has,
    set,
    get,
    delete: remove,
  };
};
