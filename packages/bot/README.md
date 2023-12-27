# The TDU Attendance System (Bot)

## Installation and Setup

The majority of the setup is done in the root directory of the project. Please refer to the [root readme](../../readme.md) for more information.

In order for the bot to work the backend must be running. To start the backend, run `pnpm dev` in the `packages/backend` directory. This will start the backend server on port `3000`.

If there's no backend running, any data relying on the backend will not be available. This includes the bot's commands and slash commands. The code will still run, but it will not be able to do anything and will throw errors.
