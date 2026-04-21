import { Test, TestingModule } from '@nestjs/testing';
import { CreateEmployeeUseCase } from './create-employee.usecase';
import { EmployeeModel } from '../../domain/models/employee';

const makeSut = async () => {
  const testModule: TestingModule = await Test.createTestingModule({
    controllers: [CreateEmployeeUseCase],
    providers: [],
  }).compile();

  const sut = testModule.get<CreateEmployeeUseCase>(CreateEmployeeUseCase);

  return {
    sut,
  };
};

describe('CreateEmployeeUseCase', () => {
  it('should be defined', async () => {
    const { sut } = await makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(CreateEmployeeUseCase);
  });

  it('should have an execute method', async () => {
    const { sut } = await makeSut();
    expect(sut.execute.bind(sut)).toBeDefined();
    expect(typeof sut.execute).toBe('function');
  });

  it('should return an error if password and passwordConfirmation do not match', async () => {
    const { sut } = await makeSut();
    const params = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'manager' as EmployeeModel.Role,
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword456',
    };

    const execute = sut.execute(params);
    await expect(execute).rejects.toThrow(
      'Password and passwordConfirmation do not match',
    );
  });
});
