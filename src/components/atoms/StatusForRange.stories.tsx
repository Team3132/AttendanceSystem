import { ComponentMeta, ComponentStory } from "@storybook/react";
import { rest } from "msw";
import { Rsvp } from "../../generated";
import SWRConfigWithFetcher from "../SWRProviderWithFetcher";
import StatusForRange from "./StatusForRange";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Atoms/StatusForRange",
  component: StatusForRange,
  argTypes: {
    handleEventRSVPUpdate: { action: "handleEventRSVPUpdate" },
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof StatusForRange>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof StatusForRange> = (args) => (
  <SWRConfigWithFetcher>
    <StatusForRange {...args} />
  </SWRConfigWithFetcher>
);

export const Primary = Template.bind({});

Primary.parameters = {
  msw: {
    handlers: [
      rest.post<Array<Rsvp>>(
        "https://api.team3132.com/event/rsvps",
        (req, res, ctx) => {
          return res(
            ctx.json([
              {
                id: "cl6def3iu001401n0t7f9zlj6",
                description: "",
                title: "test",
                allDay: false,
                startDate: "2022-08-16T14:00:00.000Z",
                endDate: "2022-08-17T14:00:00.000Z",
              },
            ])
          );
        }
      ),
    ],
    // /event/rsvps
  },
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args
// Primary.args = {
//   children: "Button",
//   size: ""
// };

// export const Large = Template.bind({});
// Large.args = {
//   size: "lg",
//   children: "Button",
// };

// export const Small = Template.bind({});
// Small.args = {
//   size: "sm",
// };
