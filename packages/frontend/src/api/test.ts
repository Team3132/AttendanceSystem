import { defineEventHandler, getWebRequest } from "vinxi/http";

export default defineEventHandler(() => {
  const req = getWebRequest();
  return { hello: "API" };
});
