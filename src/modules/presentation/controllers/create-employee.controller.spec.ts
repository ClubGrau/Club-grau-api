import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateEmployeeController,
  EmployeeRole,
} from './create-employee.controller';
import { BadRequest } from '../http-exceptions/bad-request';

const makeSut = async () => {
  const testModule: TestingModule = await Test.createTestingModule({
    controllers: [CreateEmployeeController],
    providers: [],
  }).compile();

  const sut = testModule.get<CreateEmployeeController>(
    CreateEmployeeController,
  );

  return {
    sut,
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
      role: 'admin' as EmployeeRole,
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
      role: 'admin' as EmployeeRole,
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
      role: 'admin' as EmployeeRole,
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
      role: 'admin' as EmployeeRole,
      password: 'P@ssword123',
      passwordConfirmation: '',
    };
    const response = sut.handle(request);
    await expect(response).rejects.toThrow(BadRequest);
    await expect(response).rejects.toThrow(
      'Missing param: passwordConfirmation',
    );
  });
});
