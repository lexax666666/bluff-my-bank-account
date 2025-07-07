# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NestJS application (v11.0.1) built with TypeScript. NestJS is a progressive Node.js framework for building efficient, scalable server-side applications using Express.js under the hood.

## Essential Commands

### Development
- `npm run start:dev` - Start the application in watch mode (auto-restarts on file changes)
- `npm run start:debug` - Start in debug mode with watch enabled
- `npm run build` - Build the project (outputs to `dist/` directory)
- `npm run start:prod` - Run the production build

### Testing
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage report
- `npm run test:e2e` - Run end-to-end tests

### Code Quality
- `npm run lint` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier

## Architecture

NestJS follows a modular architecture pattern with dependency injection:

- **Modules** (`*.module.ts`): Organize the application structure
- **Controllers** (`*.controller.ts`): Handle incoming requests and return responses
- **Services** (`*.service.ts`): Contain business logic
- **DTOs** (`*.dto.ts`): Define data transfer objects for request/response validation

The application entry point is `src/main.ts` which bootstraps the root module (`src/app.module.ts`).

## Key Configuration Files

- `nest-cli.json` - NestJS CLI configuration (uses SWC for fast compilation)
- `tsconfig.json` - TypeScript configuration (targets ES2023, CommonJS modules)
- `eslint.config.mjs` - ESLint configuration using the new flat config format

## Testing Approach

- Unit tests are co-located with source files (`*.spec.ts`)
- E2E tests are in the `test/` directory
- Uses Jest as the testing framework
- Test configuration: `jest.config.js` (unit) and `test/jest-e2e.json` (e2e)

## Development Notes

- The server runs on port 3000 by default (configurable via PORT environment variable)
- Uses SWC for faster TypeScript compilation
- ESLint v9 with the new flat config format is configured
- Prettier is integrated for code formatting