type FlattenServerFn<T> = T extends (arg: { data: infer U }) => infer R
  ? (arg: { data: U }) => R
  : T extends (arg: { data?: infer U }) => infer R
    ? (arg?: { data?: U }) => R
    : T;

export default FlattenServerFn;
