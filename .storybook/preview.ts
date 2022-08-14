import theme from "../src/utils/theme";
import { initialize, mswDecorator } from "msw-storybook-addon";

initialize();

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  chakra: {
    theme,
  },
};

export const decorators = [mswDecorator];
