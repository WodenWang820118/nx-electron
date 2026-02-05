# Nx-Electron Task Tracker Suite

## Overview

This is a comprehensive Electron app showcasing multiple frontend and backend technologies integrated into a single monorepo using Nx. The project demonstrates how to build cross-platform desktop applications with various modern web frameworks and backend services.

**Technologies**: Angular, Vue 3, React 19, NestJS, Express, Spring Boot, SQLite3, TypeORM, Electron, and Nx.

## Project Structure

### Frontend Applications

The project includes three different frontend implementations of the same Task Tracker application:

- **ng-tracker**: Angular implementation with PrimeNG UI components
- **vue-tracker**: Vue 3 implementation with PrimeVue UI components
- **react-tracker**: React 19 implementation with PrimeReact UI components

All frontends provide the same functionality and share common backend APIs.

### Backend Services

The monorepo includes three different backend implementations:

- **nest-backend**: NestJS backend with TypeORM and SQLite3
- **express-backend**: Express.js backend with TypeORM and SQLite3
- **spring-backend**: Spring Boot (Java) backend with JPA

## Getting Started

### Prerequisites

- Node.js (v24 or higher)
- pnpm package manager
- For Spring backend: JDK 25+ and Maven

### Installation

```bash
pnpm install
```

## Development

### Frontend Development (Browser)

Run any frontend in development mode for browser-based development:

```bash
# Angular
pnpm run dev-ng

# Vue
pnpm run dev-vue

# React
pnpm run dev-react
```

### Backend Development

Run backend services independently:

```bash
# NestJS backend
pnpm run dev-nest

# Express backend
pnpm run dev-express

# Spring Boot backend
pnpm run dev-spring
```

### Electron Development

Run Electron app with different frontend and backend combinations:

#### With NestJS Backend

```bash
# Angular + NestJS
pnpm run dev-electron-ng

# Vue + NestJS
pnpm run dev-electron-vue

# React + NestJS
pnpm run dev-electron-react
```

#### With Spring Boot Backend

```bash
# Angular + Spring
pnpm run dev-electron-ng-spring

# Vue + Spring
pnpm run dev-electron-vue-spring

# React + Spring
pnpm run dev-electron-react-spring
```

**Note**: The Spring-backed Electron dev scripts use port 5000 by default to avoid common port 3000 conflicts. They also rebuild the frontend to ensure `VITE_TASK_API_URL` is properly configured.

**Note**: The Spring-backed Electron dev scripts use port 5000 by default to avoid common port 3000 conflicts. They also rebuild the frontend to ensure `VITE_TASK_API_URL` is properly configured.

## Building

### Build Frontends

```bash
# Angular (development)
pnpm run build-ng

# Angular (production)
pnpm run build-prod-ng

# Vue (development/production)
pnpm run build-vue
pnpm run build-prod-vue

# React (development/production)
pnpm run build-react
pnpm run build-prod-react
```

### Build Backends

```bash
# NestJS
pnpm run build-nest
pnpm run build-prod-nest

# Express
pnpm run build-express
pnpm run build-prod-express

# Spring Boot
pnpm run build-spring
```

The Spring backend builds to `dist/spring-backend/app.jar`.

## Packaging & Distribution

### Create Distributables

Create platform-specific Electron packages:

```bash
# Default build (uses profile configuration)
pnpm run make

# Specific frontend + backend combinations:

# Angular combinations
pnpm run make:ng-nest
pnpm run make:ng-express
pnpm run make:ng-spring

# Vue combinations
pnpm run make:vue-nest
pnpm run make:vue-express
pnpm run make:vue-spring

# React combinations
pnpm run make:react-nest
pnpm run make:react-express
pnpm run make:react-spring
```

The build output will be a platform-specific package (zip for Windows by default). Modify `forge.config.mjs` to configure builds for other platforms.

### Package Without Making Distributable

Use `package` commands instead of `make` to create a packaged app without a distributable:

```bash
pnpm run package
pnpm run package:ng-nest
# ... etc.
```

## Publishing

Publish to configured release channels:

```bash
# Publish all Node.js backend variants
pnpm run publish:all-node

# Publish all variants (including Spring)
pnpm run publish:all

# Publish specific combinations
pnpm run publish:ng-nest
pnpm run publish:vue-spring
# ... etc.
```

## Testing

```bash
# Run backend tests with coverage
pnpm run test-back:cov
```

## Troubleshooting

### SQLite3 Dependencies

If NestJS backend with TypeORM doesn't find SQLite3 dependencies, run:

```bash
pnpm approve-builds
```

This allows you to select and execute post-install scripts for native dependencies.

## Project Configuration

- **Monorepo**: Managed with Nx
- **Package Manager**: pnpm (enforced via preinstall script)
- **Electron Forge**: Used for packaging and distribution
- **Build Tools**: Vite (frontends), Rspack (Node.js backends), Maven (Spring)

## License

MIT
