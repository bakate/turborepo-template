# Turborepo Template

A modern full-stack Turborepo template with a Nest.js API, a React/Vite frontend,
shared domain models, XState application machines, Mantine UI exports, and a
strict TypeScript/Biome toolchain.

Maintained by [Bakate](https://github.com/bakate/turborepo-template).

## Stack

- **Monorepo**: Turborepo + pnpm workspaces
- **Backend**: Nest.js, DDD, hexagonal architecture, Zod validation, Scalar docs
- **Frontend**: React, Vite, Mantine through a workspace UI package
- **Application state**: XState machines in `packages/application`
- **Domain**: Shared framework-free TypeScript models in `packages/domain`
- **Quality**: Biome, Vitest, strict TypeScript, Husky, Commitlint, lint-staged

## Requirements

- Node.js `>=22.14`
- pnpm `>=11`

## Quick Start

```sh
pnpm install
pnpm dev
```

Default local URLs:

- API: `http://localhost:3000/api`
- API docs: `http://localhost:3000/api/docs`
- OpenAPI JSON: `http://localhost:3000/api/docs/openapi.json`
- Web: `http://localhost:5173`

## Scripts

| Command | Description |
| :-- | :-- |
| `pnpm dev` | Start development tasks through Turborepo |
| `pnpm build` | Build/typecheck all buildable apps and packages |
| `pnpm test` | Run tests across the monorepo |
| `pnpm test:coverage` | Run tests with coverage where configured |
| `pnpm check` | Run Biome checks and write safe fixes |
| `pnpm format` | Run Biome formatting |
| `pnpm lint` | Run Biome linting |
| `pnpm clean` | Remove local build/cache artifacts per workspace |

Recommended validation before committing:

```sh
pnpm check
pnpm test
pnpm build
```

## Workspace Layout

```txt
apps/
  api/        Nest.js HTTP API
  web/        React + Vite frontend

packages/
  application/  Framework-agnostic application workflows and ports
  domain/       Shared domain models and validation
  ui/           Mantine facade with explicit package exports

tooling/
  biome-config/  Shared Biome configuration
  typescript/    Shared TypeScript configurations
  vitest-config/ Shared Vitest configuration helpers
```

## Backend Architecture

The API lives in `apps/api` and uses a light DDD + hexagonal structure per
module.

```txt
apps/api/src/modules/todos/
  domain/          Entity and business rules
  application/     Use cases and ports
  infrastructure/  Technical adapters, repositories, providers
  presentation/    HTTP controllers, request DTOs, OpenAPI schemas
```

Rules:

- `domain` contains business rules and has no Nest dependency.
- `application` contains use cases and depends on ports, not concrete adapters.
- `infrastructure` implements ports.
- `presentation` maps HTTP requests/responses to application use cases.
- Controllers stay thin. They validate input, call use cases, and map errors.

The API currently includes:

- Helmet security headers
- Rate limiting with `@nestjs/throttler`
- Zod request validation
- Stable error response body
- Environment validation at startup
- Scalar API documentation

Error response shape:

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Request validation failed.",
    "details": []
  }
}
```

Environment variables:

| Variable | Default | Description |
| :-- | :-- | :-- |
| `PORT` | `3000` | API HTTP port |
| `CORS_ORIGIN` | unset | Allowed CORS origin |
| `API_RATE_LIMIT_TTL_MS` | `60000` | Rate-limit window in milliseconds |
| `API_RATE_LIMIT_LIMIT` | `100` | Max requests per rate-limit window |

## Frontend Architecture

The frontend lives in `apps/web`. React should stay mostly responsible for UI
composition. Business workflows belong in `packages/application`.

```txt
apps/web/src/
  features/        React hooks that connect UI to application machines
  infrastructure/  Browser adapters, HTTP gateways, storage adapters
  main.tsx         App composition
```

The Vite dev server proxies `/api` to `http://localhost:3000`, so the web app can
call API routes through relative URLs.

## Domain Package

`packages/domain` contains framework-free business models and parsing logic.

Example responsibilities:

- Branded identifiers
- Entity/value object validation
- Shared schemas for application and infrastructure boundaries
- Domain-level tests

Do not import React, Nest, HTTP clients, browser APIs, or database clients here.

## Application Package

`packages/application` contains framework-agnostic workflows. It currently uses
XState machines for todo flows.

Current public APIs:

```ts
import { createTodoMachine } from "@workspace/application/todos/machines/create-todo";
import { todoListMachine } from "@workspace/application/todos/machines/todo-list";
import type { TodoGateway } from "@workspace/application/todos/ports/todo-gateway";
```

The package exposes explicit APIs through `package.json#exports`. Avoid barrel
files like `src/index.ts` or `src/todos/index.ts`.

### Gateways

A gateway is an application port. It describes what the application needs from
the outside world without knowing how it is implemented.

```txt
XState machine
  -> TodoGateway port
    -> TodoHttpGateway adapter in apps/web
```

Example:

- `TodoGateway`: application contract
- `TodoHttpGateway`: browser HTTP implementation using `fetch`

This keeps workflows reusable if the UI changes from React to another frontend
framework.

## UI Package

`packages/ui` is a Mantine facade. It does not define custom design-system
components. It re-exports Mantine APIs through explicit entrypoints.

Example imports:

```ts
import { Button, Stack, TextInput } from "@workspace/ui/core";
import "@workspace/ui/styles.css";
```

Rules:

- Prefer Mantine primitives directly through `@workspace/ui/*` exports.
- Do not create custom CSS-heavy UI abstractions in the template.
- Add new Mantine package entrypoints through `package.json#exports` instead of
  a barrel file.

## Testing

Use Vitest for unit tests. Use `@faker-js/faker` for generated test data, but keep
assertions deterministic by storing generated values in local constants.

Good pattern:

```ts
const todoTitle = faker.lorem.words({ min: 2, max: 5 });

expect(result.value.title).toBe(todoTitle);
```

When a domain type is branded, build fixtures through the domain parser instead
of casting or manually shaping objects.

## Code Style

- TypeScript strict mode is enabled.
- No `any` for application code.
- Prefer explicit return-value errors over thrown business errors.
- Use `readonly` data shapes where possible.
- Use package `exports` for public APIs.
- Keep imports scoped to the layer that owns the dependency.

## Tooling

Biome is the formatter and linter. VS Code should use the Biome extension as the
default formatter for this workspace. Prettier and ESLint are intentionally not
part of the active formatting path.

Shared config lives in `tooling/biome-config` and is consumed by workspace-level
`biome.json` files.

## Git Hooks and CI

The template includes Husky, Commitlint, and lint-staged.

Commit messages should follow Conventional Commits:

```txt
feat: add todo creation machine
fix: handle invalid todo gateway response
```

GitHub Actions are configured to install dependencies and run repository quality
checks.

## Remote Caching

Turborepo remote caching can be enabled when needed:

```sh
npx turbo login
npx turbo link
```

## Useful Links

- [Turborepo](https://turbo.build/repo/docs)
- [Nest.js](https://docs.nestjs.com/)
- [XState](https://stately.ai/docs/xstate)
- [Mantine](https://mantine.dev/)
- [Biome](https://biomejs.dev/)
- [Zod](https://zod.dev/)
- [Vitest](https://vitest.dev/)
