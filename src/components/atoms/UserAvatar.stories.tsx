import { ComponentMeta, ComponentStory } from "@storybook/react";
import SWRConfigWithFetcher from "../SWRProviderWithFetcher";
import UserAvatar from "./UserAvatar";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Atoms/UserAvatar",
  component: UserAvatar,
  args: {
    userId: "201596915702300673",
  },

  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof UserAvatar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserAvatar> = (args) => (
  <SWRConfigWithFetcher>
    <UserAvatar {...args} />
  </SWRConfigWithFetcher>
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
