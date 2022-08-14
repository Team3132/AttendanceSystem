import { Icon } from "@chakra-ui/icons";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MdCalendarToday } from "react-icons/md";
import { withRouter } from "storybook-addon-react-router-v6";
import { NavItem } from ".";
import MobileDrawer from "./MobileDrawer";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Organisms/Nav/Mobile",
  component: MobileDrawer,
  decorators: [withRouter],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof MobileDrawer>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof MobileDrawer> = (args) => (
  <MobileDrawer {...args} />
);

const menuItems: NavItem[] = [
  {
    label: "Calendar",
    icon: <Icon as={MdCalendarToday} />,
    subitems: [
      { url: "/calendar", label: "Full" },
      { url: "/calendar/agenda", label: "Agenda" },
      { url: "/calendar/custom", label: "Custom" },
    ],
  },
];

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  menuItems,
  isOpen: true,
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
