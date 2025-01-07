import { type UseLinkPropsOptions, useLinkProps } from "@tanstack/react-router";
import React from "react";

export default function AsChildLink(
	props: UseLinkPropsOptions & {
		children: React.ReactNode;
	},
): React.JSX.Element[] {
	const linkPropsProps = useLinkProps(props);

	return React.Children.map(props.children, (child) => {
		if (React.isValidElement(child)) {
			return React.cloneElement(child, linkPropsProps); // This overwrites the props of the child
		}
		return child;
	})?.filter(Boolean) as React.JSX.Element[];

	// apply to child component
}
