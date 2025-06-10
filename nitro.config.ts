export default defineNitroConfig({
  routeRules: {
    "/assets/**": {
      headers: {
        "cache-control": `public, max-age=${365 * 24 * 60 * 60}, immutable`, // 1 year
      },
    },
  },
});
