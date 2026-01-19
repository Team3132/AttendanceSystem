import { createStart } from "@tanstack/react-start";
import { authBaseMiddleware } from "./middleware/authMiddleware";
import {
  functionLoggerMiddleware,
  requestLoggerMiddleware,
} from "./middleware/loggerMiddleware";

export const startInstance = createStart(() => {
  return {
    functionMiddleware: [functionLoggerMiddleware, authBaseMiddleware],
    requestMiddleware: [requestLoggerMiddleware],
  };
});
