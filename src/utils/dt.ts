import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";

export const getLocale = createIsomorphicFn()
  .client(() => {
    return navigator.language;
  })
  .server(() => {
    const acceptsLanguage = getRequestHeader("Accept-Language");
    const lang = acceptsLanguage?.split(",");
    return lang?.[0];
  });
