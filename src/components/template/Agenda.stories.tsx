import { ComponentMeta, ComponentStory } from "@storybook/react";
import { withRouter } from "storybook-addon-react-router-v6";
import SWRConfigWithFetcher from "../SWRProviderWithFetcher";
import Agenda from "./Agenda";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Template/Agenda",
  component: Agenda,
  decorators: [withRouter],

  args: {},
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Agenda>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Agenda> = (args) => (
  <SWRConfigWithFetcher>
    <Agenda {...args} />
  </SWRConfigWithFetcher>
);

export const Default = Template.bind({});

Default.parameters = {};

Default.args = {};

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
