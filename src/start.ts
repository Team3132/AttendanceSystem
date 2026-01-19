import { createStart } from "@tanstack/react-start";
import { authBaseMiddleware } from "./middleware/authMiddleware";
import { requestLoggerMiddleware } from "./middleware/loggerMiddleware";

export const startInstance = createStart(() => {
  return {
    functionMiddleware: [authBaseMiddleware],
    requestMiddleware: [requestLoggerMiddleware],
  };
});
