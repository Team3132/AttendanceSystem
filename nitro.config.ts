export default defineNitroConfig({
  routeRules: {
    "/_build/assets/**": {
      headers: {
        "cache-control": `public, max-age=${365 * 24 * 60 * 60 * 2}, immutable`, // 2 years
      },
    },
  },
});
