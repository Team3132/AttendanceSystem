import useTabIndex, { type TabItem } from "@/hooks/useTabIndex";
import { Tabs, type TabsProps } from "@mui/material";
import { LinkTab } from "./LinkTab";

interface LinkTabsProps extends Omit<TabsProps, "value"> {
  tabs: TabItem[];
  defaultIndex?: number;
}

/**
 * A component that renders a set of tabs that link to different routes.
 * @returns
 */
export default function LinkTabs(props: LinkTabsProps) {
  const { tabs, defaultIndex = 0, ...rest } = props;

  const matchingIndex = useTabIndex({
    tabs,
    defaultIndex,
  });

  return (
    <Tabs value={matchingIndex} {...rest}>
      {tabs.map((tab, index) => (
        <LinkTab
          to={tab.to}
          params={tab.params}
          key={tab.label}
          label={tab.label}
          value={index}
        />
      ))}
    </Tabs>
  );
}
