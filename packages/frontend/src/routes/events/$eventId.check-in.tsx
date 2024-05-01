import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/events/$eventId/check-in')({
  component: () => <div>Hello /events/$eventId/check-in!</div>
})