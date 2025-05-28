import { createConsola } from "consola";

export const consola = createConsola({
  defaults: {
    tag: "main",
  },
  formatOptions: {
    date: true,
  },
});
