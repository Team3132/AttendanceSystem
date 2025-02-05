import { ListItemButton, type ListItemButtonProps } from "@mui/material";
import { type LinkComponent, createLink } from "@tanstack/react-router";
import * as React from "react";

interface MUILinkProps extends Omit<ListItemButtonProps, "href"> {
  // Add any additional props you want to pass to the button
}

const MUILinkComponent = React.forwardRef<HTMLAnchorElement, MUILinkProps>(
  (props, ref) => {
    return <ListItemButton component={"a"} ref={ref} {...props} />;
  },
);

const CreatedLinkComponent = createLink(MUILinkComponent);

export const LinkListItemButton: LinkComponent<typeof MUILinkComponent> = (
  props,
) => {
  return <CreatedLinkComponent preload={"intent"} {...props} />;
};
