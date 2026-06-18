---
name: nestjs-test-spec
description: >-
  Generates NestJS unit test suites for ClubGrau API use cases and controllers
  (makeStubs, makeSut, @nestjs/testing). Use when the user asks to create or
  extend *.usecase.spec.ts, *.controller.spec.ts, use case tests, controller
  tests, or mentions SigninUseCase, CreateEmployeeUseCase, or controller specs.
disable-model-invocation: true
---

# NestJS Test Spec (ClubGrau)

Generates colocated unit tests for `application/usecases/` and `presentation/controllers/`.

## Before writing

1. Read the target `.usecase.ts` or `.controller.ts`.
2. Note: injected deps (class vs string token), `requiredFields`, `try/catch`, `domainErrorStatusMap`, `QueryBus`, return shape.
3. Place spec beside source: `{name}.usecase.spec.ts` or `{name}.controller.spec.ts`.
4. Pick a profile below — **read the source, not the module name**.

## Mandatory structure

Every spec uses **`makeStubs` → `makeSut` → `describe`**:

```typescript
const makeStubs = () => ({
  dependencyStub: {
    method: jest.fn().mockResolvedValue(...) as jest.MockedFunction<Dep['method']>,
  } satisfies Pick<Dep, 'method'>, // or full interface / class
});

const makeSut = async () => {
  const { dependencyStub } = makeStubs();
  const testModule = await Test.createTestingModule({
    controllers: [...], // controller specs only
    providers: [
      UseCaseClass, // or omit and use useValue only
      { provide: TokenOrClass, useValue: dependencyStub },
    ],
  }).compile();
  const sut = testModule.get(SutClass);
  return { sut, dependencyStub };
};
```

- Return all stubs from `makeSut` for spies.
- Mirror production DI: same class or string token as in `*.module.ts`.
- Use cases are registered by **class** (`SigninUseCase`, `CreateEmployeeUseCase`); ports use **string tokens** (`'ENCRYPTER_PORT'`, etc.).

---

## Use case profiles

| Profile | Reference | When |
|---------|-----------|------|
| **Simple / stub** | `src/modules/auth/application/usecases/signin.usecase.ts` | No `@Inject`, no domain services — stub or thin orchestration |
| **Full** | `src/modules/employees/application/usecases/create-employee.usecase.spec.ts` | Ports, domain services, domain errors thrown from `execute` |

### Simple use case — initial suite

When **creating** a new spec file, add only:

- `should be defined` + `toBeInstanceOf`

Add further cases (`execute`, success, errors, port spies) incrementally as the use case is implemented — do not scaffold extra `it` blocks upfront.

### Full use case — minimum cases

All simple cases, plus:

- One test per domain error path (`rejects.toBeInstanceOf`, `rejects.toThrow`)
- Spy on port/domain service with exact arguments
- `should throw if <dependency> throws` when dependency can reject

Register in `makeSut`:

```typescript
providers: [
  CreateEmployeeUseCase,
  { provide: CheckEmployeeExistenceService, useValue: checkStub },
  { provide: 'ENCRYPTER_PORT', useValue: encrypterStub },
  { provide: 'CREATE_EMPLOYEE_REPOSITORY_PORT', useValue: repoStub },
],
```

---

## Controller profiles

| Profile | Reference spec | When |
|---------|----------------|------|
| **Sign-in** | `src/modules/auth/presentation/controllers/signin.controller.spec.ts` | Validation + use case + `try/catch` + `ServerError`, **no** `domainErrorStatusMap` |
| **Full HTTP** | `src/modules/employees/presentation/controllers/create-employee.controller.spec.ts` | Validation + use case + `domainErrorStatusMap` + mapped/unmapped errors |
| **CQRS** | `src/modules/employees/presentation/controllers/get-all-employees.controller.spec.ts` | Only `QueryBus.execute`, no body validation |

Decision tree:

```
Has QueryBus only?     → CQRS profile
Has domainErrorStatusMap? → Full HTTP profile
Else                   → Sign-in profile
```

### All controller profiles — shared cases

- `should be defined` + `toBeInstanceOf`
- One `it` per `requiredFields` entry with `''` → `BadRequest` + `MissingParamError` message
- Spy on `useCase.execute` or `queryBus.execute` with exact payload

### Sign-in / Full — extra cases

- Success response shape (e.g. `{ token }`, `{ id }`)
- Unmapped throw from use case → `ServerError` + message `'Internal server error'`

### Full HTTP only

- Mapped domain error → `HttpException` / `rejects.toHaveProperty('status', <code>)`
- Use real domain error classes from the module under test

Stub the use case in providers:

```typescript
{ provide: SigninUseCase, useValue: signinStub }
// or
{ provide: CreateEmployeeUseCase, useValue: createEmployeeUseCaseStub }
```

CQRS stub:

```typescript
{ provide: QueryBus, useValue: queryBusStub }
```

---

## Imports (adjust `../` depth)

| Symbol | Typical path |
|--------|--------------|
| `BadRequest` | `employees/presentation/http-exceptions/bad-request` |
| `MissingParamError` | `employees/presentation/errors/missing-param.error` |
| `ServerError` (employees controllers) | `employees/presentation/http-exceptions/server-error` |
| `ServerError` (auth controllers) | `shared/errors/http-expections/server.error` |
| Domain errors | `<module>/domain/errors/` |

---

## Workflow checklist

Copy and track:

```
- [ ] Read source file and pick profile
- [ ] Create colocated *.spec.ts
- [ ] makeStubs + makeSut with correct providers/tokens
- [ ] Minimum test cases for profile
- [ ] Run: npm test -- <path-to-spec>
- [ ] Fix lint/type errors
```

---

## Do not

- Add e2e or supertest tests (unit only)
- Test NestJS framework behavior unrelated to the class
- Use string tokens for use case classes when production uses the class
- Weaken assertions to match incomplete implementations
- Invent DI tokens — verify `*.module.ts` and existing specs

---

## After generating

```bash
npm test -- src/modules/<module>/application/usecases/<name>.usecase.spec.ts
npm test -- src/modules/<module>/presentation/controllers/<name>.controller.spec.ts
```

For extended templates and file paths, see [reference.md](reference.md).
