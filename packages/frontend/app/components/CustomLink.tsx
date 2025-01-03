import * as React from "react";
import { createLink, LinkComponent } from "@tanstack/react-router";
import { Button, ButtonProps } from "@mui/material";

interface MUILinkProps extends Omit<ButtonProps, "href"> {
  // Add any additional props you want to pass to the button
}

const MUILinkComponent = React.forwardRef<HTMLAnchorElement, MUILinkProps>(
  (props, ref) => {
    return <Button component={"a"} ref={ref} {...props} />;
  },
);

const CreatedLinkComponent = createLink(MUILinkComponent);

export const CustomLink: LinkComponent<typeof MUILinkComponent> = (props) => {
  return <CreatedLinkComponent preload={"intent"} {...props} />;
};
