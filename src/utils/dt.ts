import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { logger } from "./logger";

export const getLocale = createIsomorphicFn()
  .client(() => {
    logger.debug("Called getLocale", navigator.language);
    return navigator.language;
  })
  .server(() => {
    const acceptsLanguage = getRequestHeader("Accept-Language");
    const lang = acceptsLanguage?.split(",");
    logger.debug("Called getLocale", lang?.[0]);
    return lang?.[0];
  });
