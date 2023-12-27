# The TDU Attendance System

- [Frontend Readme](packages/frontend/README.md)
- [Backend Readme](packages/backend/readme.md)
- [Bot Readme](packages/bot/README.md)

## About

This is a simple attendance system for TDU students. It is written in TypeScript to improve the code quality and maintainability. It has a few components:

- **Frontend**: The frontend is written using the React framework. It is a single page application that communicates with the backend using an awesome project called [tRPC](https://trpc.io/).
- **Backend**: The backend is served using [Fastify](https://www.fastify.io/). It processes requests through [tRPC](https://trpc.io/) from the frontend and bot and communicates with the database.
- **Bot**: The bot is written using the [NestJS](https://nestjs.com/) framework. It communicates with the backend using [tRPC](https://trpc.io/) and interfaces with Discord over a wrapper library for [discord.js](https://discord.js.org/) called [Necord](https://necord.org/)

## Features

- [x] **Attendance**: Students can check in to meetings and events using the bot or the frontend.
- [x] **RSVPs**: Students can RSVP to meetings and events using the bot or the frontend.
- [x] **Outreach**: If students volunteer to help out with events, their outreach hours are tallied and added to a leaderboard accessible from the bot or the frontend.
- [x] **Google Calendar Integration**: Events are automatically pulled from the team's Google Calendar and added to the database. This is done using a cron job that runs every day at ~midnight.
- [x] **Live Updates**: If a student checks in to an event, the frontend will update in real time to reflect that. This is done using [tRPC](https://trpc.io/).
- [ ] **Build Season Points**: Students can earn points during the build season (added by mentors) and the points are tallied and added to a leaderboard accessible from the bot or the frontend.

## Development

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v21) - This is the runtime for the project.
- [PNPM](https://pnpm.io/) (v8) - This is the package manager for the project.
- [Docker](https://www.docker.com/) - This is used to run the database and Redis server.

### Setup

1. Clone the repository.
2. Run `pnpm i` to install the dependencies.
3. Populate the `.env` file with the required values. (Found in `.env.example` files)
4. Run `pnpm dev` to start the development servers for the backend, frontend and bot.

### Database and Redis

The database is run using Docker. To start the database, run `docker-compose up -d` in the root directory of the project. To stop the database, run `docker-compose down` in the root directory of the project. The database is exposed on port `5432` and the Redis server is exposed on port `6379`.

### Folder Structure

- **`/packages`**: This is where the code for the different parts of the project is stored.
  - **`/backend`**: This is where the code for the backend is stored.
  - **`/bot`**: This is where the code for the bot is stored.
  - **`/frontend`**: This is where the code for the frontend is stored.

### Further Setup

Further instructions for the different parts of the project can be found in the `README.md` files in the respective directories.

## Automatic Updates

The project uses [Renovate](https://www.mend.io/renovate/) to automatically update dependencies. Renovate will automatically create pull requests to update dependencies. These pull requests will be automatically merged if they pass the CI checks.

## Extra Resources

- **[Fireship](https://www.youtube.com/@Fireship)**: This is a great YouTube channel for learning about web development.
- **[The Net Ninja](https://www.youtube.com/channel/UCW5YeuERMmlnqo4oq8vwUpg)**: This is another great YouTube channel for learning about web development.
- **[TypeScript](https://www.typescriptlang.org/)**: This is the language used for the project.
