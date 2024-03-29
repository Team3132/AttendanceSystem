import type { AnyRoute, RoutePaths } from "@tanstack/react-router";
import type { RegisteredRouter } from "@tanstack/react-router";
import { type UseLinkPropsOptions, useLinkProps } from "@tanstack/react-router";
import React from "react";

export default function AsChildLink<
  TRouteTree extends AnyRoute = RegisteredRouter["routeTree"],
  TFrom extends RoutePaths<TRouteTree> | string = string,
  TTo extends string = "",
  TMaskFrom extends RoutePaths<TRouteTree> | string = TFrom,
  TMaskTo extends string = "",
>(
  props: UseLinkPropsOptions<TRouteTree, TFrom, TTo, TMaskFrom, TMaskTo> & {
    children: React.ReactNode;
  },
) {
  const linkPropsProps = useLinkProps(props);

  return React.Children.map(props.children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, linkPropsProps); // This overwrites the props of the child
    }
    return child;
  });

  // apply to child component
}
