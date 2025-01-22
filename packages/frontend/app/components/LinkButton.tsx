import * as React from "react";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import { Button, type ButtonProps } from "@mui/material";

interface MUILinkProps extends Omit<ButtonProps, "href"> {
  // Add any additional props you want to pass to the button
}

const MUILinkComponent = React.forwardRef<HTMLAnchorElement, MUILinkProps>(
  (props, ref) => {
    return <Button component={"a"} ref={ref} {...props} />;
  },
);

const CreatedLinkComponent = createLink(MUILinkComponent);

export const LinkButton: LinkComponent<typeof MUILinkComponent> = (props) => {
  return <CreatedLinkComponent preload={"intent"} {...props} />;
};
