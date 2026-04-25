import { Test, TestingModule } from '@nestjs/testing';
import { CreateEmployeeController } from './create-employee.controller';
import { BadRequest } from '../http-exceptions/bad-request';
import { CreateEmployeeUseCase } from '../../application/usecases/create-employee.usecase';
import { EmployeeModel } from '../../domain/models/employee';
import { MissingParamError } from '../errors/missing-param.error';
import { ServerError } from '../http-exceptions/server-error';
import { PasswordNotMatchError } from '../../domain/errors/password-not-match.error';

const makeStubs = () => ({
  createEmployeeUseCaseStub: {
    execute: jest
      .fn()
      .mockResolvedValue({ id: 'valid_id' }) as jest.MockedFunction<
      CreateEmployeeUseCase['execute']
    >,
  } satisfies Pick<CreateEmployeeUseCase, 'execute'>,
});

const makeSut = async () => {
  const { createEmployeeUseCaseStub } = makeStubs();
  const testModule: TestingModule = await Test.createTestingModule({
    controllers: [CreateEmployeeController],
    providers: [
      {
        provide: CreateEmployeeUseCase,
        useValue: createEmployeeUseCaseStub,
      },
    ],
  }).compile();

  const sut = testModule.get<CreateEmployeeController>(
    CreateEmployeeController,
  );

  return {
    sut,
    createEmployeeUseCaseStub,
  };
};

describe('CreateEmployeeController', () => {
  it('should be defined', async () => {
    const { sut } = await makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(CreateEmployeeController);
  });

  it('should return badRequest if name is not provided', async () => {
    const { sut } = await makeSut();
    const request = {
      name: '',
      email: 'john.doe@example.com',
      role: 'admin' as EmployeeModel.Role,
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword123',
    };
    const response = sut.handle(request);
    await expect(response).rejects.toThrow(BadRequest);
    await expect(response).rejects.toThrow(
      new MissingParamError('name').message,
    );
  });

  it('should return badRequest if email is not provided', async () => {
    const { sut } = await makeSut();
    const request = {
      name: 'John Doe',
      email: '',
      role: 'admin' as EmployeeModel.Role,
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword123',
    };
    const response = sut.handle(request);
    await expect(response).rejects.toThrow(BadRequest);
    await expect(response).rejects.toThrow(
      new MissingParamError('email').message,
    );
  });

  it('should return badRequest if role is not provided', async () => {
    const { sut } = await makeSut();
    const request = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: null,
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword123',
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const response = sut.handle(request as any);
    await expect(response).rejects.toThrow(BadRequest);
    await expect(response).rejects.toThrow(
      new MissingParamError('role').message,
    );
  });

  it('should return badRequest if password is not provided', async () => {
    const { sut } = await makeSut();
    const request = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin' as EmployeeModel.Role,
      password: '',
      passwordConfirmation: 'P@ssword123',
    };
    const response = sut.handle(request);
    await expect(response).rejects.toThrow(BadRequest);
    await expect(response).rejects.toThrow(
      new MissingParamError('password').message,
    );
  });

  it('should return badRequest if passwordConfirmation is not provided', async () => {
    const { sut } = await makeSut();
    const request = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin' as EmployeeModel.Role,
      password: 'P@ssword123',
      passwordConfirmation: '',
    };
    const response = sut.handle(request);
    await expect(response).rejects.toThrow(BadRequest);
    await expect(response).rejects.toThrow(
      new MissingParamError('passwordConfirmation').message,
    );
  });

  it('should call createEmployeeUsecCase with correct values', async () => {
    const { sut, createEmployeeUseCaseStub } = await makeSut();
    const request = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin' as EmployeeModel.Role,
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword123',
    };
    const createEmployeeUseCaseSpy = jest.spyOn(
      createEmployeeUseCaseStub,
      'execute',
    );
    await sut.handle(request);

    expect(createEmployeeUseCaseSpy).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword123',
    });
  });

  it('should return server error if createEmployeeUseCase throws', async () => {
    const { sut, createEmployeeUseCaseStub } = await makeSut();
    const request = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin' as EmployeeModel.Role,
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword123',
    };
    jest
      .spyOn(createEmployeeUseCaseStub, 'execute')
      .mockImplementationOnce(() => {
        throw new Error('Server error');
      });
    const response = sut.handle(request);
    await expect(response).rejects.toThrow(ServerError);
    await expect(response).rejects.toThrow('Internal server error');
  });

  it('should return an id for employee created on success', async () => {
    const { sut } = await makeSut();
    const request = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin' as EmployeeModel.Role,
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword123',
    };
    const response = await sut.handle(request);
    expect(response).toEqual({
      id: 'valid_id',
    });
  });

  it('should throw HttpException with correct status for mapped domain errors', async () => {
    const { sut, createEmployeeUseCaseStub } = await makeSut();
    jest
      .spyOn(createEmployeeUseCaseStub, 'execute')
      .mockImplementationOnce(() => {
        throw new PasswordNotMatchError();
      });
    const request = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin' as EmployeeModel.Role,
      password: 'P@ssword123',
      passwordConfirmation: 'different',
    };
    const response = sut.handle(request);
    await expect(response).rejects.toThrow(
      'Password and passwordConfirmation do not match',
    );
    // O HttpException do NestJS tem status 400 para esse erro
    await expect(response).rejects.toHaveProperty('status', 400);
  });

  it('should throw ServerError for unmapped errors', async () => {
    const { sut, createEmployeeUseCaseStub } = await makeSut();
    jest
      .spyOn(createEmployeeUseCaseStub, 'execute')
      .mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });
    const request = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin' as EmployeeModel.Role,
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword123',
    };
    const response = sut.handle(request);
    await expect(response).rejects.toThrow(ServerError);
    await expect(response).rejects.toThrow('Internal server error');
  });
});
