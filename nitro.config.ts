export default defineNitroConfig({
  routeRules: {
    "/_build/assets/**": {
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
      },
    },
  },
});
