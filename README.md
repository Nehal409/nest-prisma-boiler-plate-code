# NestJS Boiler Plate Code

## Tech Stack
- NodeJS 20 (LTS)
- NestJS (API framework)
- Postgres 16
- Prisma ORM
- Docker
- Docker Compose
- AWS CDK (IaC)

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Setup
```bash
# Create .env file and update env variables wherever necessary
$ cp .env.sample .env
```

## Running the app
```bash
# watch mode
$ docker compose up --build
```

## Managing Database migrations
```bash
# We are using Prisma ORM, make sure docker compose is up and running
$ npm run migrate:create

# Generating database migrations
$ npm run migrate:generate
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

