import { logger } from "@/utils/logger";
import { createMiddleware } from "@tanstack/react-start";

export const requestLoggerMiddleware = createMiddleware().server(
  async ({ request, next }) => {
    const startTime = performance.now();

    logger
      .withTag("Request")
      .start(`${request.method} ${request.url} - Starting`);

    try {
      const result = await next();
      const duration = performance.now() - startTime;

      logger
        .withTag("Request")
        .success(
          `${request.method} ${request.url} - ${result.response.status} (${Math.round(duration)}ms)`,
        );

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      logger
        .withTag("Request")
        .error(
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

  logger
    .withTag("Function")
    .start(`${serverFnMeta.filename} ${serverFnMeta.name} - Starting`);

  try {
    const result = await next();
    const duration = performance.now() - startTime;

    logger
      .withTag("Function")
      .success(
        `${serverFnMeta.filename} ${serverFnMeta.name} - (${Math.round(duration)}ms)`,
      );

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    logger
      .withTag("Function")
      .error(
        `${serverFnMeta.filename} ${serverFnMeta.name} - Error (${Math.round(duration)}ms):`,
        error,
      );
    throw error;
  }
});
