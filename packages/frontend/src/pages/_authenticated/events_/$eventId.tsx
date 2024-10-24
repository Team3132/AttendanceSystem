import AsChildLink from '@/components/AsChildLink'
import DefaultAppBar from '@/components/DefaultAppBar'
import { trpc } from '@/trpcClient'
import { TabItem } from '@/types/TabItem'
import { Tab, Tabs } from '@mui/material'
import { Outlet, createFileRoute } from '@tanstack/react-router'
import { DateTime } from 'luxon'
import { useMemo } from 'react'

export const Route = createFileRoute('/_authenticated/events_/$eventId')({
  loader: async ({ context: { queryUtils }, params: { eventId } }) => {
    const eventData = await queryUtils.events.getEvent.ensureData(eventId)
    const authStatus = await queryUtils.auth.status.ensureData()

    return {
      initialEvent: eventData,
      initialAuth: authStatus,
    }
  },
  component: Component,
})

function Component() {
  const loaderData = Route.useLoaderData()

  const { initialAuth, initialEvent } = loaderData

  const authStatusQuery = trpc.auth.status.useQuery(undefined, {
    initialData: initialAuth,
  })

  const eventQuery = trpc.events.getEvent.useQuery(initialEvent.id, {
    initialData: initialEvent,
  })

  const tabs = useMemo<Array<TabItem>>(
    () =>
      !authStatusQuery.data.isAdmin
        ? ([
            {
              label: 'Details',
              to: '/events/$eventId',
              params: {
                eventId: eventQuery.data.id,
              },
            },
            {
              label: 'Check In',
              to: '/events/$eventId/check-in',
            },
          ] as TabItem[])
        : ([
            {
              label: 'Details',
              to: '/events/$eventId',
              params: {
                eventId: eventQuery.data.id,
              },
            },
            {
              label: 'Check In',
              to: '/events/$eventId/check-in',
              params: {
                eventId: eventQuery.data.id,
              },
            },
            {
              label: 'QR Code',
              to: '/events/$eventId/qr-code',
              params: {
                eventId: eventQuery.data.id,
              },
            },
          ] as TabItem[]),
    [authStatusQuery.data.isAdmin, eventQuery.data.id],
  )

  return (
    <>
      <DefaultAppBar
        title={`${DateTime.fromMillis(
          Date.parse(eventQuery.data.startDate),
        ).toLocaleString(DateTime.DATE_SHORT)} - ${eventQuery.data.title}`}
      />
      <Tabs variant="scrollable" scrollButtons="auto">
        {tabs.map((tab, index) => (
          <AsChildLink to={tab.to} params={tab.params} key={tab.label}>
            <Tab key={tab.to} label={tab.label} value={index} />
          </AsChildLink>
        ))}
      </Tabs>
      <Outlet />
    </>
  )
}
