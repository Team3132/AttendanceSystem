import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profile/pending')({
  component: () => <div>Hello /profile/pending!</div>
})