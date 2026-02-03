# Nx-Electron

## Overview

This is a sample Electron app powered by Angular, Vue, React, Nest, SQLite3, Electron, and Nx. The project showcases the minimum setup to build an Electron app with multiple frontend frameworks.

## Frontend Frameworks

The project includes three different frontend implementations of the same Task Tracker application:

- **ng-tracker**: Angular implementation
- **vue-tracker**: Vue 3 implementation
- **react-tracker**: React 19 implementation

All three frontends share the same backend API built with NestJS.

## Development

Please run `pnpm install` to install the required dependencies.

For local development with Angular frontend:

```bash
pnpm run dev-front
```

For local development with Vue frontend:

```bash
pnpm run dev-vue
```

For local development with React frontend:

```bash
pnpm run dev-react
```

For backend development:

```bash
pnpm run dev-back
```

For local Electron development, please run

```bash
pnpm run dev-back
```

```bash
pnpm run dev-electron
```

## Spring Backend (Java)

Prereqs: JDK 17 and Maven (`mvn`) on PATH.

Build Spring backend jar into `dist/spring-backend/app.jar`:

```bash
pnpm run build-spring
```

Run Spring backend in terminal (without Electron):

```bash
pnpm run dev-spring
```

Run Electron (dev) with Spring backend:

```bash
pnpm run dev-electron-vue-spring
```

Note: The Spring-backed Electron dev scripts use port 5000 by default to avoid common port 3000 conflicts.
They also rebuild the frontend (skip Nx cache) so `VITE_TASK_API_URL` is applied.

## Build

Please run

```bash
pnpm run make
```

## Approve Builds

In case the NestJS backend with TypeORM doesn't find the sqilte3 as dependencies, please run

```bash
pnpm approve-builds
```

to select and execute post script installations.

The command generates a zip file and it's for Windows machine. Please change the settings in the `forge.config.js` to build the app according to the OS.
