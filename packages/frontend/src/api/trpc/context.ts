import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { type Context } from "hono";
import {
  getCookie as getHonoCookie,
  setCookie as setHonoCookie,
} from "hono/cookie";
import { Cookie, CookieOptions, CookiePrefixOptions } from "hono/utils/cookie";

export interface GetCookieWithoutContext {
  (key: string): string | undefined;
  (): Cookie;
  (key: string, prefixOptions: CookiePrefixOptions): string | undefined;
}

export async function createContext(
  opts: FetchCreateContextFnOptions,
  c: Context,
): Promise<TRPCContext> {
  const getCookie: GetCookieWithoutContext = (...args: unknown[]) => {
    if (args.length === 1) {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      return getHonoCookie(c, args[0] as string) as any;
    }

    if (args.length === 2) {
      return getHonoCookie(
        c,
        args[0] as string,
        args[1] as CookiePrefixOptions,
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      ) as any;
    }

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return getHonoCookie(c) as any;
  };

  const setCookie = (namestr: string, value: string, opt?: CookieOptions) =>
    setHonoCookie(c, namestr, value, opt);

  return {
    setCookie,
    getCookie,
    headers: opts.req.headers,
  };
}

export type TRPCContext = {
  setCookie: (name: string, value: string, options?: CookieOptions) => void;
  getCookie: GetCookieWithoutContext;
  headers: Headers;
};
