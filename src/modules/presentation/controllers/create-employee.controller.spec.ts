import { Test, TestingModule } from '@nestjs/testing';
import { CreateEmployeeController } from './create-employee.controller';
import { BadRequest } from '../http-exceptions/bad-request';

type EmployeeRole = 'admin' | 'employee' | 'manager';

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
});
