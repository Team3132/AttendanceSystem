import { createIsomorphicFn } from "@tanstack/react-start";
import { LogLevels, createConsola } from "consola";

const createLogger = createIsomorphicFn()
  .server(() => {
    const base = createConsola({
      // level: import.meta.env.DEV ? LogLevels.debug : undefined,
      formatOptions: {
        date: true,
      },
    }).withTag("SERVER");

    if (import.meta.env.PROD) {
      base.setReporters([
        {
          log: (logObj) => console.log(JSON.stringify(logObj)),
        },
      ]);
    }

    return base;
  })
  .client(() =>
    createConsola({
      level: LogLevels.debug,
    }).withTag("CLIENT"),
  );

export const logger = createLogger();
