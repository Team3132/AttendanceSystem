# TDU Attendance Frontend

## Links

- [Production](https://attendance.team3132.com)
- [Backend Repository](https://github.com/Team3132/AttendanceBackend)

## Description

A project started to better coordinate both student and mentor attendance.

## Stack

- [ReactJS](https://reactjs.org) - A popular web framework for stateful apps.
- [React Router](https://reactrouter.com) - The most popular routing solution for react apps.
- [Chakra-UI](https://chakra-ui.com) - A UI component framework that works well on desktop and mobile screen sizes.
- [SWR](https://swr.vercel.app) - A flexible data fetching library to avoid duplication of requests and manage state. `isLoading`,`isError` etc.
- [Vite](https://vitejs.dev) - The compiler for the project. Very fast and reasonably easy to configure.
- [Storybook](https://storybook.js.org/) - Framework for prototyping and testing UI components.

## Getting started

If you want to edit this project then I would recommend knowing a little bit about ReactJS.

Prerequisites: [NodeJS](https://nodejs.org), [Yarn](https://yarnpkg.com)

1. Install dependancies with `yarn install`
2. Start the project with `yarn dev`

## Deployment

At the moment the frontend is setup to use vercel's static site hosting which is directly linked to the reposity (may cease to work under TDU org). It will update the site on push to the master branch.

Note: In the future the backend should be able to serve the frontend code because cookie authentication doesn't like subdomains and cloudflare pages has a limit for API function requests.
