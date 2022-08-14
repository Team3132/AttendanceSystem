import { ComponentMeta, ComponentStory } from "@storybook/react";
import Calendar from ".";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Organisms/Calendar/Custom",
  component: Calendar,
  argTypes: {
    onRange: { action: "onRange" },
    onEmptyClicked: { action: "onEmptyClicked" },
    onEventClicked: { action: "onEventClicked" },
  },
  args: {
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
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Calendar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Calendar> = (args) => (
  <Calendar {...args} />
);

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

// export const Large = Template.bind({});
// Large.args = {
//   size: "lg",
//   children: "Button",
// };

// export const Small = Template.bind({});
// Small.args = {
//   size: "sm",
// };
