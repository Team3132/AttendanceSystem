import { ComponentMeta, ComponentStory } from "@storybook/react";
import { withRouter } from "storybook-addon-react-router-v6";
import RootCal from "./";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Custom Calendar",
  component: RootCal,
  decorators: [withRouter],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof RootCal>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof RootCal> = (args) => (
  <RootCal {...args} />
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  onRange: () => {},
  events: [
    {
      id: "cl6def3iu001401n0t7f9zlj6",
      description: "",
      title: "test",
      allDay: false,
      startDate: "2022-08-16T14:00:00.000Z",
      endDate: "2022-08-17T14:00:00.000Z",
    },
  ],
};

// export const Large = Template.bind({});
// Large.args = {
//   size: "lg",
//   children: "Button",
// };

// export const Small = Template.bind({});
// Small.args = {
//   size: "sm",
// };
