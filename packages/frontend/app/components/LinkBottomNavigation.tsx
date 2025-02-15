import useTabIndex, { type TabItem } from "@/hooks/useTabIndex";
import { BottomNavigation, type BottomNavigationProps } from "@mui/material";
import { BottomNavigationLink } from "./BottomNavigationLink";

interface LinkTabsProps extends Omit<BottomNavigationProps, "value"> {
  tabs: TabItem[];
  defaultIndex?: number;
}

/**
 * A component that renders a set of tabs that link to different routes.
 * @returns
 */
export default function LinkBottomNavigation(props: LinkTabsProps) {
  const { tabs, defaultIndex, ...rest } = props;

  const matchingIndex = useTabIndex({
    tabs,
    defaultIndex,
  });

  return (
    <BottomNavigation value={matchingIndex} {...rest}>
      {tabs.map((route, index) => (
        <BottomNavigationLink
          label={route.label}
          icon={route.icon}
          value={index}
          to={route.to}
          params={route.params}
          key={route.to}
        />
      ))}
    </BottomNavigation>
  );
}
