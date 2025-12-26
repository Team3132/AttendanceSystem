import { Chip, type ChipProps } from "@mui/material";
import { type LinkComponent, createLink } from "@tanstack/react-router";
import * as React from "react";

interface MUILinkProps extends Omit<ChipProps, "href"> {
  // Add any additional props you want to pass to the button
}

const MUILinkComponent = React.forwardRef<HTMLAnchorElement, MUILinkProps>(
  (props, ref) => {
    return <Chip component={"a"} ref={ref} {...props} />;
  },
);

const CreatedLinkComponent = createLink(MUILinkComponent);

export const LinkChip: LinkComponent<typeof MUILinkComponent> = (props) => {
  return <CreatedLinkComponent preload={"intent"} {...props} />;
};
