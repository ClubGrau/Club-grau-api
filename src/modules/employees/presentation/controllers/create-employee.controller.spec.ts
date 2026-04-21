import { Test, TestingModule } from '@nestjs/testing';
import { CreateEmployeeController } from './create-employee.controller';
import { BadRequest } from '../http-exceptions/bad-request';
import { CreateEmployeeUseCase } from '../../application/usecases/create-employee.usecase';
import { InternalServerErrorException } from '@nestjs/common';
import { EmployeeModel } from '../../domain/models/employee';

const makeStubs = () => ({
  createEmployeeUseCaseStub: {
    execute: jest
      .fn()
      .mockResolvedValue({ id: 'valid_id' }) as jest.MockedFunction<
      CreateEmployeeUseCase['execute']
    >,
  } satisfies CreateEmployeeUseCase,
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
    await expect(response).rejects.toThrow('Missing param: name');
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
    await expect(response).rejects.toThrow('Missing param: email');
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
    await expect(response).rejects.toThrow('Missing param: role');
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
    await expect(response).rejects.toThrow('Missing param: password');
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
      'Missing param: passwordConfirmation',
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
    await expect(response).rejects.toThrow(InternalServerErrorException);
    await expect(response).rejects.toThrow('Internal Server Error');
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
});
