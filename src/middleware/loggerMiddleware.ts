import { logger } from "@/utils/logger";
import { createMiddleware } from "@tanstack/react-start";

export const requestLoggerMiddleware = createMiddleware().server(
  async ({ request, next }) => {
    const startTime = performance.now();

    logger.debug(`${request.method} ${request.url} - Starting`);

    try {
      const result = await next();
      const duration = performance.now() - startTime;

      logger.debug(
        `${request.method} ${request.url} - ${result.response.status} (${Math.round(duration)}ms)`,
      );

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      logger.error(
        `${request.method} ${request.url} - Error (${Math.round(duration)}ms):`,
        error,
      );
      throw error;
    }
  },
);

export const functionLoggerMiddleware = createMiddleware({
  type: "function",
}).server(async ({ method, next, serverFnMeta }) => {
  const startTime = performance.now();

  logger.debug(
    `${method} ${serverFnMeta.filename} ${serverFnMeta.name} - Starting`,
  );

  try {
    const result = await next();
    const duration = performance.now() - startTime;

    logger.debug(
      `${method} ${serverFnMeta.filename} ${serverFnMeta.name} - (${Math.round(duration)}ms)`,
    );

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    logger.error(
      `${method} ${serverFnMeta.filename} ${serverFnMeta.name} - Error (${Math.round(duration)}ms):`,
      error,
    );
    throw error;
  }
});
