import { Test, TestingModule } from '@nestjs/testing';
import { SigninUseCase } from './signin.usecase';
import { EmployeePoliciesService } from '../../../employees/domain/services/employee-policies.service';
import { EmployeeNotFoundError } from '../../../employees/domain/errors/employee-not-found.error';
import { InactiveEmployeeError } from '../../../employees/domain/errors/inactive-employee.error';
import { PasswordValidatorPort } from '../ports/password-validator.port';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';
import { GenerateTokenPort } from '../ports/generate-token.port';

const makeStubs = () => ({
  employeePoliciesServiceStub: {
    checkIsActive: jest.fn().mockResolvedValue({
      id: 'valid_id',
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'valid_hashed_password',
      nif: null,
      role: 'employee',
      isActive: true,
      createdAt: new Date(),
      deactivateAt: null,
    }) as jest.MockedFunction<EmployeePoliciesService['checkIsActive']>,
  } satisfies Pick<EmployeePoliciesService, 'checkIsActive'>,
  passwordValidatorStub: {
    compare: jest.fn().mockResolvedValue(true) as jest.MockedFunction<
      PasswordValidatorPort['compare']
    >,
  } satisfies Pick<PasswordValidatorPort, 'compare'>,
  generateTokenStub: {
    generate: jest
      .fn()
      .mockResolvedValue({ token: 'valid_token' }) as jest.MockedFunction<
      GenerateTokenPort<any>['generate']
    >,
  } satisfies Pick<GenerateTokenPort<any>, 'generate'>,
});

const makeSut = async () => {
  const {
    employeePoliciesServiceStub,
    passwordValidatorStub,
    generateTokenStub,
  } = makeStubs();
  const testModule: TestingModule = await Test.createTestingModule({
    providers: [
      SigninUseCase,
      {
        provide: EmployeePoliciesService,
        useValue: employeePoliciesServiceStub,
      },
      {
        provide: 'PASSWORD_VALIDATOR_PORT',
        useValue: passwordValidatorStub,
      },
      {
        provide: 'GENERATE_TOKEN_PORT',
        useValue: generateTokenStub,
      },
    ],
  }).compile();
  const sut = testModule.get<SigninUseCase>(SigninUseCase);
  return {
    sut,
    employeePoliciesServiceStub,
    passwordValidatorStub,
    generateTokenStub,
  };
};

describe('SigninUseCase', () => {
  it('should be defined', async () => {
    const { sut } = await makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(SigninUseCase);
  });

  it('should call employeePoliciesService.checkIsActive with the correct email', async () => {
    const { sut, employeePoliciesServiceStub } = await makeSut();
    const email = 'john.doe@example.com';
    const checkIsActiveSpy = jest.spyOn(
      employeePoliciesServiceStub,
      'checkIsActive',
    );

    await sut.execute({ email, password: '123456' });
    expect(checkIsActiveSpy).toHaveBeenCalledWith('john.doe@example.com');
  });

  it('should throw EmployeeNotFoundError when checkIsActive returns it', async () => {
    const { sut, employeePoliciesServiceStub } = await makeSut();
    employeePoliciesServiceStub.checkIsActive.mockResolvedValueOnce(
      new EmployeeNotFoundError(),
    );
    const promise = sut.execute({
      email: 'john.doe@example.com',
      password: '123456',
    });
    await expect(promise).rejects.toBeInstanceOf(EmployeeNotFoundError);
    await expect(promise).rejects.toThrow('Employee not found');
  });

  it('should throw InactiveEmployeeError when checkIsActive returns it', async () => {
    const { sut, employeePoliciesServiceStub } = await makeSut();
    employeePoliciesServiceStub.checkIsActive.mockResolvedValueOnce(
      new InactiveEmployeeError(),
    );

    const promise = sut.execute({
      email: 'john.doe@example.com',
      password: '123456',
    });
    await expect(promise).rejects.toBeInstanceOf(InactiveEmployeeError);
    await expect(promise).rejects.toThrow('Existent employee is inactive');
  });

  it('should call passwordValidator with correct params', async () => {
    const { sut, passwordValidatorStub } = await makeSut();
    const comparePasswordSpy = jest.spyOn(passwordValidatorStub, 'compare');
    await sut.execute({ email: 'john.doe@example.com', password: '123456' });
    expect(comparePasswordSpy).toHaveBeenCalledWith(
      '123456',
      'valid_hashed_password',
    );
  });

  it('should throw InvalidCredentials error when password is incorrect', async () => {
    const { sut, passwordValidatorStub } = await makeSut();
    passwordValidatorStub.compare.mockResolvedValueOnce(false);
    const promise = sut.execute({
      email: 'john.doe@example.com',
      password: '123456',
    });
    await expect(promise).rejects.toBeInstanceOf(InvalidCredentialsError);
    await expect(promise).rejects.toThrow('Invalid credentials');
  });

  it('should call GenerateTokenPort with the correct payload', async () => {
    const { sut, generateTokenStub } = await makeSut();
    const payload = {
      id: 'valid_id',
      email: 'john.doe@example.com',
      role: 'employee',
    };
    const generateTokenSpy = jest.spyOn(generateTokenStub, 'generate');
    await sut.execute({ email: 'john.doe@example.com', password: '123456' });
    expect(generateTokenSpy).toHaveBeenCalledWith(payload);
  });

  it('should return access token if all valid data is provided to login', async () => {
    const { sut } = await makeSut();
    const request = {
      email: 'john.doe@example.com',
      password: '123456',
    };
    const response = await sut.execute(request);
    expect(response).toEqual({ token: 'valid_token' });
  });
});
