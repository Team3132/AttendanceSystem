import type { NavigateOptions } from "@tanstack/react-router";
import type { AnyRoute, RoutePaths } from "@tanstack/react-router";

export type TabItem<
  TRouteTree extends AnyRoute = AnyRoute,
  TFrom extends RoutePaths<TRouteTree> | string = string,
  TTo extends string = "",
> = {
  label: string;
  icon?: React.ReactElement | string;
  disabled?: boolean;
  fuzzy?: boolean;
} & NavigateOptions<TRouteTree, TFrom, TTo>;
