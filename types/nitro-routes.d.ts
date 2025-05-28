declare module "nitropack/types" {
  type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;
  interface InternalApi {}
}
