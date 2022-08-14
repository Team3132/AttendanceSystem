import theme from "../src/utils/theme";
import { initialize, mswDecorator } from "msw-storybook-addon";
import { rest } from "msw";
import type { Event, AuthStatusDto, User, Rsvp } from "../src/generated";
import { handlers } from "../mock";

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
  msw: {
    handlers,
  },
};

export const decorators = [mswDecorator];
