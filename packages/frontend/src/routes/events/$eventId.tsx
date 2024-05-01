import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/events/$eventId')({
  component: () => <div>Hello /events/$eventId!</div>
})