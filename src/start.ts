import { createStart } from "@tanstack/react-start";
import { authBaseMiddleware } from "./middleware/authMiddleware";

export const startInstance = createStart(() => {
  return {
    functionMiddleware: [authBaseMiddleware],
  };
});
