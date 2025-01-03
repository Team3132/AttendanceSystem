import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export default function sessionSecretToHex() {
  const rootpath = path.dirname(fileURLToPath(import.meta.url));
  const keyBuffer = fs.readFileSync(path.join(rootpath, "../secret-key"));
  console.log("keyBuffer", keyBuffer, "keyBuffer");
  const hexString = keyBuffer.toString("hex");
  console.log("str", hexString, "str");
}
