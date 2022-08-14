import { ComponentMeta, ComponentStory } from "@storybook/react";
import TDUIcon from "./TDUIcon";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Atoms/TDU Icon",
  component: TDUIcon,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof TDUIcon>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TDUIcon> = (args) => (
  <TDUIcon {...args} />
);

export const Primary = Template.bind({});
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
