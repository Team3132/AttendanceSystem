/**
 * Any function that returns a QueryKey
 */
// biome-ignore lint/suspicious/noExplicitAny: Needed for a generic query key returning function definition
type AnyQueryKeyReturningFunction = (...args: any[]) => QueryKey;

/**
 * A record of query keys that can be used to strictly type query keys in the application
 */
type QueryKeysObject = Record<string, QueryKey | AnyQueryKeyReturningFunction>;

/**
 * Get the union of all valid resulting QueryKeys from a QueryKeysObject
 *
 * This is useful for strictly typing any functions that accept a QueryKey as an argument
 *
 * @param T The QueryKeysObject to get the resulting QueryKeys from
 * @returns The union of all valid QueryKeys
 */
export type QueryKeyValues<T extends QueryKeysObject> = Flatten<
  {
    [K in keyof T]: T[K] extends QueryKey // If the value is a QueryKey
      ? T[K] // Return the QueryKey
      : T[K] extends AnyQueryKeyReturningFunction // If the value is a function that returns a QueryKey
        ? ReturnType<T[K]> // Return the QueryKey that the function returns
        : never; // Otherwise, the value is invalid
  }[keyof T]
>; // Get the union of all valid QueryKeys
