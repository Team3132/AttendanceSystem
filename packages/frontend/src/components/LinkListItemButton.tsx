import { ListItemButton, type ListItemButtonProps } from "@mui/material";
import { type LinkComponentProps, createLink } from "@tanstack/react-router";
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

type FinalProps = Omit<LinkComponentProps<typeof MUILinkComponent>, "ref"> & {
  ref: React.Ref<HTMLAnchorElement>;
};

export const LinkListItemButton = (props: FinalProps) => {
  const wrappedRef = React.useRef<React.Ref<HTMLAnchorElement>>(null);

  React.useEffect(() => {
    // If wrappedRef.current is defined, assign it to anchorRef.current
    if (props.ref) {
      wrappedRef.current = props.ref;
    }
  }, [props.ref]);

  return (
    <CreatedLinkComponent preload={"intent"} {...props} ref={wrappedRef} />
  );
};
