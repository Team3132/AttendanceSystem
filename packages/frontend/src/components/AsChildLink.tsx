import { type UseLinkPropsOptions, useLinkProps } from "@tanstack/react-router";
import React from "react";

export default function AsChildLink(
  props: UseLinkPropsOptions & {
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
