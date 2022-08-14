import { ComponentMeta, ComponentStory } from "@storybook/react";
import UserList from "./UserList";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Organisms/User List",
  component: UserList,
  args: {
    users: [
      {
        id: "12345",
        firstName: "Sebastian",
        lastName: "Pietschner",
        email: "seb@email.com",
      },
    ],
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof UserList>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserList> = (args) => (
  <UserList {...args} />
);

export const Default = Template.bind({});
Default.args = {};
export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
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
