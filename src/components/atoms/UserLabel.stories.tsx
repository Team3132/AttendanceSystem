import { ComponentMeta, ComponentStory } from "@storybook/react";
import UserLabel from "./UserLabel";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Atoms/User Label",
  component: UserLabel,
  args: {
    name: "Sebastian",
    size: "md",
    avatarSrc: "https://avatars.githubusercontent.com/u/32213671?v=4",
    status: "Coming",
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof UserLabel>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserLabel> = (args) => (
  <UserLabel {...args} />
);

export const Online = Template.bind({});
Online.args = {
  badge: "Online",
};
export const Offline = Template.bind({});
Offline.args = {
  badge: "Offline",
};
export const Unknown = Template.bind({});
Unknown.args = {
  badge: "Unknown",
};
export const NoBadge = Template.bind({});
NoBadge.args = {
  badge: undefined,
};
export const NoAvatar = Template.bind({});
NoAvatar.args = {
  avatarSrc: undefined,
  badge: "Online",
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
