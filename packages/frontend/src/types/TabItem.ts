import type { NavigateOptions } from "@tanstack/react-router";
import type { AnyRoute, RoutePaths } from "@tanstack/react-router";

export type TabItem = {
  label: string;
  icon?: React.ReactElement | string;
  disabled?: boolean;
  fuzzy?: boolean;
} & NavigateOptions;
