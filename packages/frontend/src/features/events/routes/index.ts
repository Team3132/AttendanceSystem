import { adminOnlyRoute, authedOnlyRoute } from "@/features/auth/routes";
import { Route, lazyRouteComponent } from "@tanstack/react-router";
import { DateTime } from "luxon";

const eventsRoute = new Route({
  getParentRoute: () => authedOnlyRoute,
  path: "/events",
});

const eventsIndexRoute = new Route({
  getParentRoute: () => eventsRoute,
  path: "/",
  loader: async ({ context: { queryUtils } }) => {
    const [initialAuth] = await Promise.all([
      queryUtils.auth.status.ensureData(),
      queryUtils.events.getEvents.prefetchInfinite({
        from: DateTime.now().startOf("day").toISO() ?? undefined,
        to:
          DateTime.now().plus({ month: 1 }).startOf("day").toISO() ?? undefined,
        type: undefined,
        limit: 5,
      }),
    ]);

    return {
      initialAuth,
    };
  },
  component: lazyRouteComponent(
    () => import("../pages/EventsHome"),
    "Component",
  ),
});

const eventsCreateRoute = new Route({
  getParentRoute: () => eventsRoute,
  path: "/create",
  component: lazyRouteComponent(
    () => import("../pages/EventCreate"),
    "Component",
  ),
});

const eventRoute = new Route({
  getParentRoute: () => eventsRoute,
  path: "$eventId",
  loader: async ({ context: { queryUtils }, params }) => {
    const [initialAuth, initialEvent] = await Promise.all([
      queryUtils.auth.status.ensureData(),
      queryUtils.events.getEvent.ensureData(params.eventId),
    ]);

    return {
      initialAuth,
      initialEvent,
    };
  },
  component: lazyRouteComponent(
    () => import("../pages/EventPage"),
    "Component",
  ),
});

const eventIndexRoute = new Route({
  getParentRoute: () => eventRoute,
  path: "/",
  loader: async ({ context: { queryUtils }, params }) => {
    const [initialAuth, initialEvent] = await Promise.all([
      queryUtils.auth.status.ensureData(),
      queryUtils.events.getEvent.ensureData(params.eventId),
    ]);

    return {
      initialAuth,
      initialEvent,
    };
  },
  component: lazyRouteComponent(
    () => import("../pages/EventDetails"),
    "Component",
  ),
});

const eventCheckinRoute = new Route({
  getParentRoute: () => eventRoute,
  path: "/check-in",
  loader: async ({ context: { queryUtils }, params }) => {
    const [initialAuth, initialEvent] = await Promise.all([
      queryUtils.auth.status.ensureData(),
      queryUtils.events.getEvent.ensureData(params.eventId),
    ]);

    return {
      initialAuth,
      initialEvent,
    };
  },
  component: lazyRouteComponent(
    () => import("../pages/EventCheckin"),
    "Component",
  ),
});

export const eventQrCodeRoute = new Route({
  getParentRoute: () => adminOnlyRoute,
  path: "/events/$eventId/qr-code",
  loader: async ({ context: { queryUtils }, params }) => {
    const [initialAuth, initialEvent, initialEventSecret] = await Promise.all([
      queryUtils.auth.status.ensureData(),
      queryUtils.events.getEvent.ensureData(params.eventId),
      queryUtils.events.getEventSecret.ensureData(params.eventId),
    ]);

    return {
      initialAuth,
      initialEvent,
      initialEventSecret,
    };
  },
  component: lazyRouteComponent(
    () => import("../pages/EventQRCode"),
    "Component",
  ),
});

export const eventsRoutes = eventsRoute.addChildren([
  eventsIndexRoute,
  eventsCreateRoute,
  eventRoute.addChildren([eventIndexRoute, eventCheckinRoute]),
]);
