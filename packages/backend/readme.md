# The TDU Attendance System (Backend)

## Installation and Setup

The majority of the setup is done in the root directory of the project. Please refer to the [root readme](../../readme.md) for more information.

## Development

To develop the backend by itself (without the frontend and bot), run `pnpm dev` in the `packages/backend` directory. This will start the backend server on port `3000`.

## Database

The database of choice for this project is PostgreSQL. The database is run using Docker. To start the database, run `docker-compose up -d` in the root directory of the project. To stop the database, run `docker-compose down` in the root directory of the project. The database is exposed on port `5432`.

The library used to interface with the database is [DrizzleORM](https://orm.drizzle.team/), which is a wrapper around native database bindings. It is a very simple and lightweight ORM that is easy to use and understand as it closely resembles SQL.

To edit the database schema edit the `src/drizzle/schema.ts` file. To generate migrations based on the schema run `pnpm generate` in the `packages/backend` directory. This will generate a migration file in the `src/drizzle/migrations` directory.

When the backend is started, the migrations will be run automatically.
