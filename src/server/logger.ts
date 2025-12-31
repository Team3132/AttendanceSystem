import { LogLevels, createConsola } from "consola";

export const consola = createConsola({
  level: LogLevels.debug,
  defaults: {
    tag: "main",
  },
  formatOptions: {
    date: true,
  },
});
