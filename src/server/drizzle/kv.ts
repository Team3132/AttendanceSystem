import KeyvPostgres from "@keyv/postgres";
import Keyv from "keyv";
import env from "../env";

export const kv = new Keyv(
  new KeyvPostgres({
    connectionString: env.DATABASE_URL,
    table: "keyv",
  }),
);
kv.on("error", (err) => {
  console.error("Connection Error:", err);
});
