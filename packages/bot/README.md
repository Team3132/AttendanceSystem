# TDU Attendance API/Backend

## Links

- [Production](https://attendance.team3132.com)

- [NestJS Readme](README_NESTJS.md)
- [API Reference (Swagger)](https://api.team3132.com/api)
- [Frontend Repository](https://github.com/Team3132/AttendanceFrontend)

## Description

A project started to better coordinate both student and mentor attendance.

## Stack

- [NestJS](https://docs.nestjs.com) - An extensible framework for building APIs with NodeJS. Comes with many utility packages to implement common API features like authentication.
- [Prisma](https://www.prisma.io) - A database ORM used to interact with the postgres db that stores all the project's data.
- [Discord-NestJS](https://github.com/fjodor-rybakov/discord-nestjs) - A NestJS module for building discord bots. Allows direct connection with API functions through dependancy injection.

## Getting started

If you want to familiarise yourself with how NestJS works in detail I would recommend watching [this video](https://www.youtube.com/watch?v=GHTA143_b-s). Though editing the codebase should not require too high a level of understanding.

## Deployment

Currently the project builds a docker container when the Github Action is manually triggered. This allows deployment to a variety of platforms pretty easily. At the moment I'm using [Cloudflare tunnels](https://www.cloudflare.com/products/tunnel/) on my server machine at home to link it the the `team3132.com` domain.
