import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/events/$eventId/qr-code')({
  component: () => <div>Hello /events/$eventId/qr-code!</div>
})