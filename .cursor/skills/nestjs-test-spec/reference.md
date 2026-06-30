# NestJS Test Spec — Reference

## Canonical example files

| Type | Path |
|------|------|
| Use case (full) | `src/modules/employees/application/usecases/create-employee.usecase.spec.ts` |
| Use case (stub) | `src/modules/auth/application/usecases/signin.usecase.ts` |
| Controller (sign-in) | `src/modules/auth/presentation/controllers/signin.controller.spec.ts` |
| Controller (full HTTP) | `src/modules/employees/presentation/controllers/create-employee.controller.spec.ts` |
| Controller (CQRS) | `src/modules/employees/presentation/controllers/get-all-employees.controller.spec.ts` |
| CQRS handler | `src/modules/employees/application/queries/get-all-employees/handler.spec.ts` |

## Stub use case spec skeleton

For `SigninUseCase`-style classes with no dependencies:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { SigninUseCase } from './signin.usecase';

const makeStubs = () => ({});

const makeSut = async () => {
  makeStubs();
  const testModule: TestingModule = await Test.createTestingModule({
    providers: [SigninUseCase],
  }).compile();
  const sut = testModule.get<SigninUseCase>(SigninUseCase);
  return { sut };
};

describe('SigninUseCase', () => {
  it('should be defined', async () => {
    const { sut } = await makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(SigninUseCase);
  });
});
```

Add more `it` blocks only as the use case gains behavior.

## Controller validation test pattern

```typescript
it('should return badRequest if email is not provided', async () => {
  const { sut } = await makeSut();
  const request = { email: '', password: 'P@ssword123' };
  const response = sut.handle(request);
  await expect(response).rejects.toThrow(BadRequest);
  await expect(response).rejects.toThrow(
    new MissingParamError('email').message,
  );
});
```

## DI tokens in employees module

| Token | Consumer |
|-------|----------|
| `'ENCRYPTER_PORT'` | `CreateEmployeeUseCase` |
| `'CREATE_EMPLOYEE_REPOSITORY_PORT'` | `CreateEmployeeUseCase` |
| `'FIND_ACTIVE_EMPLOYEE_BY_EMAIL'` | `CheckEmployeeExistenceService` |
| `'GET_ALL_EMPLOYEES_REPOSITORY_PORT'` | `GetAllEmployeesHandler` |

## domainErrorStatusMap entries

Located in `src/modules/employees/presentation/http-exceptions/http-error.mapper.ts`:

- `InvalidNameFormatError`, `InvalidEmailFormatError`, `InvalidPasswordFormatError`, `InvalidNifFormatError`, `PasswordNotMatchError` → 400
- `ExistEmployeeError`, `InactiveEmployeeError` → 409

When adding new mapped errors, update the map and add a controller spec case.
