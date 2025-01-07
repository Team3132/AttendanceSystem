import AsChildLink from "@/components/AsChildLink";
import DefaultAppBar from "@/components/DefaultAppBar";
import { usersQueryOptions } from "@/queries/users.queries";

import type { TabItem } from "@/types/TabItem";
import { Tab, Tabs } from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
	Outlet,
	createFileRoute,
	useChildMatches,
} from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createFileRoute("/_authenticated/admin_/users/$userId")({
	component: Component,
	loader: ({ params: { userId }, context: { queryClient } }) =>
		queryClient.prefetchQuery(usersQueryOptions.userDetails(userId)),
});

function Component() {
	const { userId } = Route.useParams();

	const userQuery = useSuspenseQuery(usersQueryOptions.userDetails(userId));

	const tabs = useMemo<TabItem[]>(
		() => [
			{
				label: "Scancodes",
				to: "/admin/users/$userId",
				params: {
					userId: userId,
				},
			},
			{
				label: "Pending",
				to: "/admin/users/$userId/pending",
				params: {
					userId: userId,
				},
			},
		],
		[userId],
	);

	const currentChildren = useChildMatches();

	const matchingIndex = useMemo(
		() =>
			tabs.findIndex((tab) =>
				currentChildren.some((child) => child.fullPath === tab.to),
			),
		[currentChildren, tabs],
	);

	return (
		<>
			<DefaultAppBar title={`${userQuery.data.username}'s Profile`} />
			<Tabs value={matchingIndex}>
				{tabs.map((tab, index) => (
					<AsChildLink to={tab.to} params={tab.params} key={tab.to}>
						<Tab key={tab.to} label={tab.label} value={index} />
					</AsChildLink>
				))}
			</Tabs>
			<Outlet />
		</>
	);
}
