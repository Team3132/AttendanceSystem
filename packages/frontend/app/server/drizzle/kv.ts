import KeyvPostgres from "@keyv/postgres";
import Keyv from "keyv";
import env from "../env";

const pgUrl = `postgres://${env.VITE_POSTGRES_USER}:${env.VITE_POSTGRES_PASSWORD}@${env.VITE_POSTGRES_HOST}:5432/${env.VITE_POSTGRES_DB}`;

export const kv = new Keyv(
  new KeyvPostgres({
    connectionString: pgUrl,
    table: "keyv",
  }),
);
kv.on("error", (err) => {
  console.error("Connection Error:", err);
});
