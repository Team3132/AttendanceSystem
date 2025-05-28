import {
  BottomNavigationAction,
  type BottomNavigationActionProps,
} from "@mui/material";
import { type LinkComponent, createLink } from "@tanstack/react-router";
import * as React from "react";

interface MUIBottomNavigationProps
  extends Omit<BottomNavigationActionProps, "href"> {
  // Add any additional props you want to pass to the button
}

const MUIBottomNavigationLinkComponent = React.forwardRef<
  HTMLAnchorElement,
  MUIBottomNavigationProps
>((props, ref) => {
  return <BottomNavigationAction component={"a"} ref={ref} {...props} />;
});

const CreateBottomNavigationLinkComponent = createLink(
  MUIBottomNavigationLinkComponent,
);

export const BottomNavigationLink: LinkComponent<
  typeof MUIBottomNavigationLinkComponent
> = (props) => {
  return <CreateBottomNavigationLinkComponent preload={"intent"} {...props} />;
};
