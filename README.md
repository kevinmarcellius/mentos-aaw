# Marketplace API

**Rayhan Putra Randi**<br>
**2106705644**

## Overview

Microservice based REST API for a marketplace application built with Express.js, PostgreSQL, and Drizzle ORM.

Each microservice has their own dedicated database as the load of the application is currently unknown, and the services use data that mostly revolve around their own service.

## Prerequisites

- Node.js 18.18.2
- pnpm
- Docker and Docker Compose
- PostgreSQL (if running locally)

## Quick Start with Docker

1. On each service, generate the database migration file with:

    ```bash
    pnpm run generate
    ```
2. Create `.env` file, and fill the variables with the correct values (including database migration filepath).
3. Run each services with `make` (e.g. `make auth-up`).


## Local Development Setup

On each service, run the following commands:

```bash
# Install dependencies
pnpm install

# Setup database
pnpm run generate # Generate migrations

pnpm run migrate # Run migrations

# Start development server
pnpm debug

```

For admin token, exec into authentication service then run:

```
npm run generate-token-prod
```

### Notes
1. Approve builds for `bcrypt`, `es5-ext`, `esbuild` with `pnpm approve-builds`.
2. Set `Auto Attach` on VSC to `Always` to enable debugging.

## Environment Variables

Copy `.env.example` to `.env` and configure the variable values accordingly.


## Available Scripts

```bash
pnpm dev # Development mode with hot reload
pnpm build # Build production
pnpm start # Start production server
pnpm generate # Generate DB migrations
pnpm migrate # Run DB migrations
pnpm generate-token # Generate admin token
pnpm generate-token-prod # Generate admin token on production
pnpm debug # Run with swagger api docs
```

## API Endpoints

API documentation is available through Postman. 

Import the `aaw-marketplace.postman_collection.json` and `aaw-marketplace.postman_environment.json` into Postman to use the available API documentation. Dedicated documentation in the form of Swagger generated JSON's are also available in each service's `src/docs` directory.

## Database Schema

Managed through Drizzle ORM with migrations in drizzle directory.
