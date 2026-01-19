import { logger } from "@/utils/logger";
import { createMiddleware } from "@tanstack/react-start";

export const requestLoggerMiddleware = createMiddleware().server(
  async ({ request, next }) => {
    const startTime = performance.now();

    logger.start(`${request.method} ${request.url} - Starting`);

    try {
      const result = await next();
      const duration = performance.now() - startTime;

      logger.success(
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
}).server(async ({ next, serverFnMeta }) => {
  const startTime = performance.now();

  logger.start(`${serverFnMeta.filename} ${serverFnMeta.name} - Starting`);

  try {
    const result = await next();
    const duration = performance.now() - startTime;

    logger.success(
      `${serverFnMeta.filename} ${serverFnMeta.name} - (${Math.round(duration)}ms)`,
    );

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    logger.error(
      `${serverFnMeta.filename} ${serverFnMeta.name} - Error (${Math.round(duration)}ms):`,
      error,
    );
    throw error;
  }
});
