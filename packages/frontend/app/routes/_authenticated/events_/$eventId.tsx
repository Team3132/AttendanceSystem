import AsChildLink from "@/components/AsChildLink";
import DefaultAppBar from "@/components/DefaultAppBar";
import { authQueryOptions } from "@/queries/auth.queries";
import { eventQueryOptions } from "@/queries/events.queries";

import type { TabItem } from "@/types/TabItem";
import { Tab, Tabs } from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
	Outlet,
	createFileRoute,
	useChildMatches,
} from "@tanstack/react-router";
import { DateTime } from "luxon";
import { useMemo } from "react";

export const Route = createFileRoute("/_authenticated/events_/$eventId")({
	loader: async ({ context: { queryClient }, params: { eventId } }) => {
		await queryClient.prefetchQuery(eventQueryOptions.eventDetails(eventId));
		await queryClient.prefetchQuery(authQueryOptions.status());
	},

	component: Component,
});

function Component() {
	const { eventId } = Route.useParams();

	const authStatusQuery = useSuspenseQuery(authQueryOptions.status());

	const eventQuery = useSuspenseQuery(eventQueryOptions.eventDetails(eventId));

	const tabs = useMemo<Array<TabItem>>(
		() =>
			!authStatusQuery.data.isAdmin
				? ([
						{
							label: "Details",
							to: "/events/$eventId/",
							params: {
								eventId: eventQuery.data.id,
							},
						},
						{
							label: "Check In",
							to: "/events/$eventId/check-in",
						},
					] as TabItem[])
				: ([
						{
							label: "Details",
							to: "/events/$eventId/",
							params: {
								eventId: eventQuery.data.id,
							},
						},
						{
							label: "Check In",
							to: "/events/$eventId/check-in",
							params: {
								eventId: eventQuery.data.id,
							},
						},
						{
							label: "QR Code",
							to: "/events/$eventId/qr-code",
							params: {
								eventId: eventQuery.data.id,
							},
						},
					] as TabItem[]),
		[authStatusQuery.data.isAdmin, eventQuery.data.id],
	);

	const currentChildren = useChildMatches();

	const matchingIndex = useMemo(
		() =>
			tabs.findIndex((tab) => {
				return currentChildren.some((child) => {
					return child.fullPath === tab.to;
				});
			}),
		[currentChildren, tabs],
	);

	return (
		<>
			<DefaultAppBar
				title={`${DateTime.fromMillis(
					Date.parse(eventQuery.data.startDate),
				).toLocaleString(DateTime.DATE_SHORT)} - ${eventQuery.data.title}`}
			/>
			<Tabs variant="scrollable" scrollButtons="auto" value={matchingIndex}>
				{tabs.map((tab, index) => (
					<AsChildLink to={tab.to} params={tab.params} key={tab.label}>
						<Tab key={tab.to} label={tab.label} value={index} />
					</AsChildLink>
				))}
			</Tabs>
			<Outlet />
		</>
	);
}
