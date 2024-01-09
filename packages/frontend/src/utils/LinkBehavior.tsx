import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "@tanstack/react-router";
import { forwardRef } from "react";

const LinkBehavior = forwardRef<
  HTMLAnchorElement,
  Omit<RouterLinkProps, "to"> & { href: RouterLinkProps["to"] }
>((props, ref) => {
  const { href, ...other } = props;
  // Map href (Material UI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />;
});

export default LinkBehavior;
