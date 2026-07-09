# Enhanced Turborepo Template

A robust, production-ready Turborepo template designed for scalablity and developer experience.

Maintained by [Bakate](https://github.com/bakate/turborepo-template).

## Features

- **Monorepo Structure**: Powered by [Turborepo](https://turbo.build/).
- **Package Manager**: [pnpm](https://pnpm.io/) for efficient dependency management.
- **Architecture**: Domain-Driven Design (DDD) & Hexagonal Architecture ready.
- **Strict TypeScript**: Configured for safety with `noImplicitOverride` and strict mode.
- **Tools**: [Vitest](https://vitest.dev/) for testing, [Zod](https://zod.dev/) for validation.
- **Code Quality**:
  - **[Biome.js](https://biomejs.dev/)**: Unified, high-performance toolchain for linting and formatting.
  - **Git Hooks**: Husky, Commitlint (Conventional commits), and Lint-Staged pre-configured.
- **CI/CD**: GitHub Actions workflow for automated testing.

## Quick Start

1.  **Install Dependencies**

    ```sh
    pnpm install
    ```

2.  **Start Development Servers**

    ```sh
    pnpm dev
    ```

## Scripts

| Command              | Description                                      |
| :------------------- | :----------------------------------------------- |
| `pnpm build`         | Build all apps and packages                      |
| `pnpm dev`           | Start development mode for all apps              |
| `pnpm test`          | Run tests across the monorepo                    |
| `pnpm test:coverage` | Run tests with V8 coverage reports               |
| `pnpm lint`          | Lint all packages (Biome)                        |
| `pnpm format`        | Check formatting (Biome)                         |
| `pnpm check`         | Run lint and format checks (Biome)               |
| `pnpm clean`         | Clean generic `node_modules` and build artifacts |
| `pnpm typecheck`     | Run TypeScript type checking                     |

## Architecture

This monorepo follows a clean architecture pattern, with Nest.js as the backend
HTTP adapter and Vite as the frontend entry point.

### Apps (`apps/*`)

- **`api`**: Nest.js HTTP API structured with DDD and hexagonal architecture.
  - `domain`: entities, value objects, and business rules.
  - `application`: use cases and ports.
  - `infrastructure`: adapters such as repositories and external providers.
  - `presentation`: HTTP controllers, request validation, and response mapping.
- **`web`**: Vite frontend application.

The API enables Helmet security headers, global rate limiting, environment-based
CORS, Zod request validation, Scalar API documentation, and explicit dependency
injection tokens where runtime reflection is not reliable enough.

API errors use a stable response contract:

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Request validation failed.",
    "details": []
  }
}
```

API environment variables are validated at startup:

| Variable                  | Default | Description                      |
| :------------------------ | :------ | :------------------------------- |
| `PORT`                    | `3000`  | HTTP port                        |
| `CORS_ORIGIN`             | unset   | Allowed CORS origin              |
| `API_RATE_LIMIT_TTL_MS`   | `60000` | Rate-limit time window in ms     |
| `API_RATE_LIMIT_LIMIT`    | `100`   | Max requests per rate-limit TTL  |

API documentation is available at:

- Scalar UI: `http://localhost:3000/api/docs`
- OpenAPI JSON: `http://localhost:3000/api/docs/openapi.json`

### Packages (`packages/*`)

- **`domain`**: The core business logic. Pure TypeScript, no framework dependencies.
  - _Example_: See `src/todos.ts` for a Zod-backed model.
- **`application`**: Use cases and orchestration (Future implementation).
- **`infrastructure`**: External services, database connections (Future implementation).
- **`ui`**: Shared UI component library (React example included).

### Tooling (`tooling/*`)

Shared configuration packages to ensure consistency:

- **`biome-config`**: Shared Biome config.
- **`typescript`**: Shared `tsconfig` bases.
- **`vitest-config`**: Shared Vitest and Coverage configurations.

## Quality Assurance

### Git Hooks

We use `husky` to enforce quality checks before commits:

- **Commit Message**: Must follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat: add user login`, `fix: resolve auth bug`).
- **Pre-commit**: Runs `lint-staged` to ensure committed files are formatted and linted.

### CI Workflow

GitHub Actions are configured in `.github/workflows/test.yml` to run:

- Installation
- Build
- Lint
- Typecheck
- Tests

## Remote Caching

Turborepo remote caching allows you to share build artifacts across your team and CI.

To enable it:

```sh
npx turbo login
npx turbo link
```

## Useful Links

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Zod](https://zod.dev/)
- [Vitest](https://vitest.dev/)
