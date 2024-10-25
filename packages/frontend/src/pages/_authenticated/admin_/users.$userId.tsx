import AsChildLink from '@/components/AsChildLink'
import DefaultAppBar from '@/components/DefaultAppBar'
import { trpc } from '@/trpcClient'
import { TabItem } from '@/types/TabItem'
import { Tab, Tabs } from '@mui/material'
import { Outlet, createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'

export const Route = createFileRoute('/_authenticated/admin_/users/$userId')({
  component: Component,
  loader: ({ params: { userId }, context: { queryUtils } }) =>
    queryUtils.users.getUser.ensureData(userId),
})

function Component() {
  const loaderData = Route.useLoaderData()

  const userQuery = trpc.users.getUser.useQuery(loaderData.id, {
    initialData: loaderData,
  })

  const tabs = useMemo<TabItem[]>(
    () => [
      {
        label: 'Scancodes',
        to: '/admin/users/$userId',
        params: {
          userId: userQuery.data.id,
        },
      },
      {
        label: 'Pending',
        to: '/admin/users/$userId/pending',
        params: {
          userId: userQuery.data.id,
        },
      },
    ],
    [userQuery.data.id],
  )

  return (
    <>
      <DefaultAppBar title={`${userQuery.data.username}'s Profile`} />
      <Tabs>
        {tabs.map((tab, index) => (
          <AsChildLink to={tab.to} params={tab.params} key={tab.to}>
            <Tab key={tab.to} label={tab.label} value={index} />
          </AsChildLink>
        ))}
      </Tabs>
      <Outlet />
    </>
  )
}
