import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/users/$userId')({
  component: () => <div>Hello /admin/users/$userId!</div>
})