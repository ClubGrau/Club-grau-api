# ClubGrau API — Agent Instructions

This document provides context and conventions for AI coding agents working on the **ClubGrau API** repository. Read it before making changes. Keep diffs focused and aligned with existing patterns.

---

## Project overview

ClubGrau API is a **NestJS 11** backend written in **TypeScript**. It follows a **modular, layered architecture** inspired by Clean Architecture / DDD:

- **Presentation** — HTTP controllers, request validation, HTTP error mapping
- **Application** — use cases, CQRS queries/handlers, repository ports
- **Domain** — entities, value objects, domain services, domain errors
- **Infrastructure** — MongoDB repositories, Mongoose schemas, adapters, Nest providers

Current feature modules:

| Module | Path | Responsibility |
|--------|------|----------------|
| `employees` | `src/modules/employees/` | Employee CRUD, domain policies, Mongo persistence |
| `auth` | `src/modules/auth/` | Sign-in flow (`SigninController` + `SigninUseCase`) |
| `shared` | `src/modules/shared/` | Reusable domain primitives (Entity, VOs, validation), shared HTTP errors, crypto adapters |
| `database` | `src/modules/database/` | Global MongoDB connection provider |

The root `AppModule` (`src/app.module.ts`) currently imports `ConfigModule`, `DatabaseModule`, and `EmployeeModule`. **`AuthModule` exists but is not yet wired into `AppModule`**, so `POST /auth/signin` is not exposed at runtime until that import is added.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | NestJS 11 (`@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`) |
| Config | `@nestjs/config` (global) |
| Database | MongoDB via Mongoose (`@nestjs/mongoose`, `mongoose`) |
| CQRS | `@nestjs/cqrs` (used in `employees` for list query) |
| Crypto | `bcrypt` via `EncrypterPort` / `BcryptAdapter` |
| Testing | Jest 30, `@nestjs/testing`, `mongodb-memory-server` |
| Lint / format | ESLint 9 (flat config), Prettier |
| Git hooks | Lefthook (pre-commit: prettier, eslint, tests; commit-msg: commitlint conventional) |

---

## Environment variables

| Variable | Required | Used by |
|----------|----------|---------|
| `DATABASE_HOST` | **Yes** | `database/providers/database.provider.ts` — MongoDB connection URI |
| `PORT` | No | `src/main.ts` — defaults to `3000` |

`.env` files are gitignored. Do not commit secrets. Example local URI:

```
DATABASE_HOST=mongodb://admin:password@localhost:27017/clubgrau?authSource=admin
PORT=3000
```

The app throws at startup if `DATABASE_HOST` is missing.

---

## Commands

```bash
# Install dependencies
npm install

# Development (watch mode) — requires DATABASE_HOST
npm run start:dev

# Production build & run
npm run build
npm run start:prod

# Run all unit tests (coverage enabled by default)
npm test

# Run a single test file
npm test -- src/modules/auth/presentation/controllers/signin.controller.spec.ts

# E2E tests
npm run test:e2e

# Lint & format
npm run lint
npm run format
```

---

## Directory structure

```
api/
├── src/
│   ├── main.ts                    # Bootstrap
│   ├── app.module.ts              # Root module
│   ├── client/                    # HTTP client files for manual API testing (.http)
│   └── modules/
│       ├── auth/
│       ├── database/
│       ├── employees/
│       └── shared/
├── test/                          # E2E tests
├── docs/                          # Diagrams (e.g. db-model.excalidraw)
├── jest.config.ts
├── lefthook.yml
├── commitlint.config.js           # Conventional commits
└── AGENTS.md                      # This file
```

---

## Module layout convention

Each feature module follows this structure:

```
src/modules/<feature>/
├── main/
│   └── <feature>.module.ts        # Nest module definition
├── presentation/
│   ├── controllers/               # HTTP controllers (+ *.spec.ts colocated)
│   ├── http-exceptions/           # Module-specific HTTP errors & mappers (employees)
│   └── errors/                    # Presentation-layer errors (e.g. MissingParamError)
├── application/
│   ├── usecases/                  # Command-style application services
│   ├── queries/                   # CQRS query + handler + result (when applicable)
│   └── ports/                     # Repository / adapter interfaces (types only)
├── domain/
│   ├── entity/                    # Aggregate roots / entities
│   ├── models/                    # DTOs, enums, namespaces (EmployeeModel, etc.)
│   ├── errors/                    # Domain-specific Error classes
│   └── services/                  # Domain services
└── infra/
    ├── database/
    │   ├── repositories/          # Mongo implementations of ports
    │   └── schemas/               # Mongoose schemas
    └── providers/                 # Factory functions: makeXxxProvider()
```

When adding a new feature, mirror this layout. Do not flatten layers into a single folder.

### Auth module (current state)

The `auth` module is minimal and still evolving:

```
src/modules/auth/
├── main/auth.module.ts
├── application/usecases/signin.usecase.ts
└── presentation/controllers/
    ├── signin.controller.ts
    └── signin.controller.spec.ts
```

There is no `auth/domain/` yet. `SigninUseCase` is a placeholder returning a hardcoded token.

---

## Domain layer

### Entity base class

All domain entities extend `Entity<Props>` from `src/modules/shared/domain/entity/entity.ts`:

- Auto-generates a Mongo-compatible `UniqueEntityId` (24-char hex)
- Exposes `id` getter and `toJSON()` that unwraps value objects to primitives

### Value objects

Located in `src/modules/shared/domain/value-object/`. Each VO:

- Extends abstract `ValueObject<T>`
- Uses a **private constructor** and static `create()` factory
- Returns either the VO instance or a typed **format error** (not thrown inside `create`)

Available VOs: `Email`, `Password`, `Name`, `Nif`, `UniqueEntityId`.

Example pattern:

```typescript
static create(value: string): InvalidEmailFormatError | Email {
  const error = Email.validate(value);
  if (error) return error;
  return new Email(value);
}
```

### Entity factory pattern

Entities use static `create()` that:

1. Validates business rules (e.g. enum values)
2. Calls `validate(...)` from `entity-validate.ts` to aggregate VO creation results
3. Returns `Entity | Error` — **never throws** during construction

See `src/modules/employees/domain/entity/Employee.ts`.

### Domain errors

- **Shared format errors**: `src/modules/shared/domain/errors/` (`InvalidEmailFormatError`, etc.)
- **Feature errors**: `src/modules/<feature>/domain/errors/` (`ExistEmployeeError`, `InactiveEmployeeError`, etc.)
- Domain errors are plain `Error` subclasses with descriptive messages
- Use `instanceof` checks and constructor-based maps for HTTP mapping in presentation

### Domain services

Example: `CheckEmployeeExistenceService` checks email uniqueness via `FIND_ACTIVE_EMPLOYEE_BY_EMAIL` port and returns `ExistEmployeeError`, `InactiveEmployeeError`, or `null`.

---

## Application layer

### Use cases

- Injectable Nest classes in `application/usecases/`
- Single public method: typically `execute(params)`
- Inject dependencies via constructor using **string tokens** for ports or concrete classes for domain services
- Throw domain errors; do not map to HTTP status here

Examples:

| Use case | Module | Status |
|----------|--------|--------|
| `CreateEmployeeUseCase` | employees | Full — encryption, existence check, entity creation, persistence |
| `SigninUseCase` | auth | Placeholder — returns `{ token: 'valid_token' }` |

### CQRS (queries)

Used for read operations that don't fit the use-case pattern:

```
application/queries/<query-name>/
├── query.ts       # Query object (input)
├── handler.ts     # @QueryHandler implementing IQueryHandler
├── result.ts      # Handler return type
└── handler.spec.ts
```

Example: `GetAllEmployeesQuery` → `GetAllEmployeesHandler` → `GetAllEmployeesResult`.

Register handlers in the feature module's `providers` array and import `CqrsModule`.

### Ports

Interfaces in `application/ports/` define repository contracts. Implementations live in `infra/database/repositories/`.

Naming convention: `<Action><Entity>RepositoryPort` or descriptive tokens like `FIND_ACTIVE_EMPLOYEE_BY_EMAIL`.

---

## Presentation layer

### Controllers

Controllers are thin. Responsibilities:

1. **Request validation** — loop over `requiredFields`, throw `BadRequest` with `MissingParamError` message
2. **Delegation** — call use case or `QueryBus`
3. **Error mapping** — optional `try/catch` with `domainErrorStatusMap` and/or `ServerError`

Routes today:

| Controller | Route | Pattern |
|------------|-------|---------|
| `CreateEmployeeController` | `POST /employee` | Use case + try/catch + `domainErrorStatusMap` |
| `GetAllEmployeesController` | `GET /employees?page&limit` | CQRS `QueryBus` |
| `SigninController` | `POST /auth/signin` | Use case + try/catch + `ServerError` (no domain map yet) |

### HTTP exceptions & presentation errors

The project has **module-scoped** and **shared** HTTP helpers. Be consistent with the module you are editing.

| Class | Location | Used by |
|-------|----------|---------|
| `BadRequest` | `employees/presentation/http-exceptions/bad-request.ts` | `CreateEmployeeController`, `SigninController` |
| `MissingParamError` | `employees/presentation/errors/missing-param.error.ts` | All controllers with body validation |
| `ServerError` | `employees/presentation/http-exceptions/server-error.ts` | `CreateEmployeeController` |
| `ServerError` | `shared/errors/http-expections/server.error.ts` | `SigninController` |
| `domainErrorStatusMap` | `employees/presentation/http-exceptions/http-error.mapper.ts` | `CreateEmployeeController` |

Note: `ServerError` is duplicated in two paths with identical behavior. `SigninController` currently imports `BadRequest` / `MissingParamError` from the **employees** presentation layer — a cross-module dependency to be aware of when refactoring.

Folder typo: `shared/errors/http-expections/` (not `exceptions`).

### Error handling patterns

**Pattern A — with domain error map** (`CreateEmployeeController`):

```typescript
catch (error) {
  if (error instanceof HttpException) throw error;
  console.error(error);
  const status = domainErrorStatusMap.get((error as Error).constructor as ...);
  if (status) throw new HttpException((error as Error).message, status);
  throw new ServerError();
}
```

**Pattern B — generic fallback only** (`SigninController`):

```typescript
catch (error) {
  if (error instanceof HttpException) throw error;
  console.error(error);
  throw new ServerError();
}
```

Add new domain errors to `domainErrorStatusMap` when they should return a specific HTTP status in employee controllers.

### DTOs

Prefer TypeScript namespaces for request/response shapes (e.g. `EmployeeModel.CreateRequestDto`). DTO files live in `domain/models/`. Auth currently uses an inline body type `{ email: string; password: string }` in the controller.

---

## Infrastructure layer

### Provider factories

Infrastructure is wired through factory functions returning `Provider[]`:

| Factory | Location | Purpose |
|---------|----------|---------|
| `makeDatabaseProvider()` | `database/providers/` | `'DATABASE_CONNECTION'` via Mongoose |
| `makeRepositoriesProvider()` | `employees/infra/providers/` | Repository port → Mongo impl |
| `makeAdaptersProvider()` | `employees/infra/providers/` | `'ENCRYPTER_PORT'` → bcrypt |
| `makeEmployeeModelProvider()` | `employees/infra/providers/` | Mongoose model registration |

Always mirror the **same injection token** in tests, use cases, and module providers.

### MongoDB connection

- Connection URI comes from `process.env.DATABASE_HOST`
- `DatabaseModule` is `@Global()` and exports the connection provider
- Provider token: `'DATABASE_CONNECTION'`

### Repository pattern

`EmployeeMongoRepository` implements multiple ports:

| Token | Purpose |
|-------|---------|
| `'CREATE_EMPLOYEE_REPOSITORY_PORT'` | Persist new employees |
| `'GET_ALL_EMPLOYEES_REPOSITORY_PORT'` | Paginated list |
| `'FIND_ACTIVE_EMPLOYEE_BY_EMAIL'` | Existence / active check |

Maps between Mongoose documents and `EmployeeModel.PrimitivesData`.

### Employee schema

`EmployeeSchema` fields: `name`, `email` (unique), `role` (enum: `admin`, `manager`, `employee`), `password`, `nif`, `isActive`, `createdAt`, `deactivateAt`.

---

## Dependency injection tokens

The project uses a mix of **class-based** and **string token** injection:

| Token / Class | Used by |
|---------------|---------|
| `CreateEmployeeUseCase` (class) | `CreateEmployeeController` |
| `SigninUseCase` (class) | `SigninController` |
| `'ENCRYPTER_PORT'` | `CreateEmployeeUseCase` |
| `'CREATE_EMPLOYEE_REPOSITORY_PORT'` | `CreateEmployeeUseCase` |
| `'GET_ALL_EMPLOYEES_REPOSITORY_PORT'` | `GetAllEmployeesHandler` |
| `'FIND_ACTIVE_EMPLOYEE_BY_EMAIL'` | `CheckEmployeeExistenceService` |
| `'DATABASE_CONNECTION'` | Mongoose setup |
| `QueryBus` (class) | `GetAllEmployeesController` |

When writing tests or new code, **always check the feature module and existing specs** to use the same token as production wiring.

---

## Cross-module dependencies

- `auth` imports presentation helpers from `employees` (`BadRequest`, `MissingParamError`)
- `auth` has no domain layer yet; no dependency on employee domain services
- `shared` has no feature dependencies; all modules may import from `shared`
- Avoid circular imports between feature modules
- Domain services depend on repository ports via `@Inject('TOKEN')`

---

## Testing

### General rules

- Test files are **colocated** with source: `*.spec.ts` next to the file under test
- Jest `roots`: `src/` (unit tests); E2E in `test/`
- Path alias: `@/` → `src/` (configured in `jest.config.ts`)
- Coverage excludes: `main.ts`, `*.module.ts`, `models/`, `ports/`, `providers/`, `schemas/`, test setup utils
- Pre-commit hook runs `npm test -- --silent --passWithNoTests`

Current spec files (18 unit tests in `src/`):

| Area | Files |
|------|-------|
| Controllers | `signin`, `create-employee`, `get-all-employees` |
| Use cases | `create-employee` (no `signin.usecase.spec.ts` yet) |
| CQRS | `get-all-employees/handler.spec.ts` |
| Domain | entity, VOs, `check-employee-existence.service` |
| Infra | `employee-mongo.repository`, `bcrypt.adapter` |

### Unit test structure (mandatory pattern)

All unit tests follow **`makeStubs` → `makeSut` → `describe`**:

```typescript
const makeStubs = () => ({
  dependencyStub: {
    method: jest.fn().mockResolvedValue(...) as jest.MockedFunction<Dep['method']>,
  } satisfies Pick<Dep, 'method'>,
});

const makeSut = async () => {
  const { dependencyStub } = makeStubs();
  const testModule = await Test.createTestingModule({ ... }).compile();
  return { sut: testModule.get(SutClass), dependencyStub };
};
```

- Use `satisfies` or `Pick<>` for typed stubs
- Return stubs from `makeSut` for spying in tests
- Prefer `@nestjs/testing` over manual instantiation
- Provider: use case **class** (e.g. `SigninUseCase`, `CreateEmployeeUseCase`) — not string tokens for use cases

### Controller spec profiles

Choose the reference spec based on controller behavior:

| Profile | Reference file | When to use |
|---------|----------------|-------------|
| **Sign-in / simple HTTP** | `src/modules/auth/presentation/controllers/signin.controller.spec.ts` | Validation + use case + `ServerError`, no `domainErrorStatusMap` |
| **Full domain mapping** | `src/modules/employees/presentation/controllers/create-employee.controller.spec.ts` | try/catch, `domainErrorStatusMap`, mapped/unmapped errors, success DTO |
| **CQRS / QueryBus** | `src/modules/employees/presentation/controllers/get-all-employees.controller.spec.ts` | Controller delegates to `QueryBus`, no body validation |

Minimum controller test cases:

1. `should be defined` (+ `toBeInstanceOf`)
2. One `it` per required field with empty string → `BadRequest` + `MissingParamError` message
3. Spy on delegated method (`execute` or `queryBus.execute`) with exact payload
4. (Sign-in profile) success response with expected shape (`{ token }`)
5. (Sign-in / full profile) unmapped error → `ServerError` with message `'Internal server error'`
6. (Full profile) mapped domain error → `HttpException` with correct status

### Service / handler / use case specs

- Same `makeStubs` / `makeSut` pattern
- Mock ports with string tokens matching production (`'GET_ALL_EMPLOYEES_REPOSITORY_PORT'`, etc.)
- Reference: `create-employee.usecase.spec.ts`, `handler.spec.ts`

### Integration / repository tests

- Use `test-setup-mongo-memory.ts` or `test-mongoose-mock.ts` from `shared/infra/utils/setups/`
- Reference: `employee-mongo.repository.spec.ts`

### After creating or modifying tests

```bash
npm test -- path/to/changed.spec.ts
```

---

## Code style & quality

- **TypeScript**: `strictNullChecks: true`, `noImplicitAny: false`
- **ESLint**: type-checked rules; `@typescript-eslint/no-explicit-any: off`; namespaces allowed
- **Prettier**: enforced via ESLint plugin; `endOfLine: auto`
- **Imports**: relative paths between modules (no barrel files yet)
- **Commits**: conventional commits enforced by commitlint via lefthook (`commitlint.config.js`)

Keep changes minimal. Match naming, indentation, and patterns of neighboring files. Do not refactor unrelated code.

---

## API manual testing

HTTP request examples live in `src/client/employe.http`. Use for local smoke tests alongside `npm run start:dev`.

Current example: `POST http://localhost:3000/employee` with employee creation payload.

---

## What NOT to do

- Do not commit `.env` files or hardcode production secrets
- Do not weaken tests to make incomplete implementations pass
- Do not skip the layered structure (e.g. putting Mongo queries in controllers)
- Do not introduce e2e/supertest tests when the task is a unit test for a controller
- Do not update the generic NestJS `README.md` unless explicitly asked
- Do not wire new modules into `AppModule` without ensuring dependencies (DB, other modules) are satisfied
- Do not create large boilerplate docs unless requested

---

## Known gaps & work in progress

These are intentional or in-progress areas — agents should be aware but not "fix" silently unless asked:

1. **`AuthModule` not imported** in `AppModule` — sign-in route is not exposed yet
2. **`SigninUseCase`** is a stub returning `{ token: 'valid_token' }` — no real authentication logic
3. **No `signin.usecase.spec.ts`** — use case is untested at unit level
4. **No `auth/domain/`** — auth has no entities, VOs, or domain errors yet
5. **Cross-module imports** — `SigninController` depends on `employees` presentation for `BadRequest` / `MissingParamError`
6. **Duplicate `ServerError`** — exists in both `employees/.../server-error.ts` and `shared/errors/http-expections/server.error.ts`
7. **Folder typo** — `shared/errors/http-expections/` should eventually be renamed to `exceptions`

When implementing auth end-to-end, align controller, use case, module wiring, domain logic, and specs together.

---

## Adding a new feature (checklist)

1. Create module folder under `src/modules/<feature>/` with layer subfolders
2. Define domain entity, VOs (reuse shared), errors, and models
3. Add application use case(s) and/or CQRS query + handler
4. Define ports; implement in `infra/database/repositories/`
5. Add provider factories in `infra/providers/`
6. Create presentation controller with validation (+ error map if needed)
7. Register everything in `main/<feature>.module.ts`
8. Import module in `AppModule`
9. Add colocated `*.spec.ts` files following existing patterns
10. Run `npm test` and `npm run lint`

---

## Related agent configuration (future)

This file is the **project-wide index**. For more granular agent setup, consider adding later (not required now):

| Artifact | Location | Purpose |
|----------|----------|---------|
| Scoped rules | `.cursor/rules/*.mdc` | File-pattern-specific hints (e.g. only `*.controller.spec.ts`) |
| Skills | `.cursor/skills/<name>/SKILL.md` | Step-by-step workflows (e.g. generating controller test suites) |

Keep `AGENTS.md` concise. Move long templates and decision trees into Skills or Rules rather than duplicating them here.
