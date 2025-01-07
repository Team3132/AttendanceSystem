import createCache from "@emotion/cache";

export const createCustomCache = () =>
	createCache({
		key: "css",
		stylisPlugins: [
			/* your plugins here */
		],
	});
