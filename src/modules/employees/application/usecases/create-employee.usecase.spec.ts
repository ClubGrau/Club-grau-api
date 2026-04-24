import { Test, TestingModule } from '@nestjs/testing';
import { CreateEmployeeUseCase } from './create-employee.usecase';
import { EmployeeModel } from '../../domain/models/employee';
import { CheckEmployeeExistenceService } from '../../domain/services/check-employee-existence.service';
import { PasswordNotMatchError } from '../../domain/errors/password-not-match.error';
import { ExistEmployeeError } from '../../domain/errors/exist-employee.error';
import { InactiveEmployeeError } from '../../domain/errors/inactive-employee.error';

const makeSub = () => ({
  checkEmployeeExistenceService: {
    check: jest.fn() as jest.Mock<Promise<Error | null>, [string]>,
  },
});

const makeSut = async () => {
  const { checkEmployeeExistenceService } = makeSub();

  const testModule: TestingModule = await Test.createTestingModule({
    providers: [
      CreateEmployeeUseCase,
      {
        provide: CheckEmployeeExistenceService,
        useValue: checkEmployeeExistenceService,
      },
    ],
  }).compile();

  const sut = testModule.get<CreateEmployeeUseCase>(CreateEmployeeUseCase);

  return {
    sut,
    checkEmployeeExistenceService,
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
    await expect(execute).rejects.toBeInstanceOf(PasswordNotMatchError);
    await expect(execute).rejects.toThrow(
      'Password and passwordConfirmation do not match',
    );
  });

  it('should return an error if employee already exists and is active', async () => {
    const { sut, checkEmployeeExistenceService } = await makeSut();
    const params = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'manager' as EmployeeModel.Role,
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword123',
    };
    jest
      .spyOn(checkEmployeeExistenceService, 'check')
      .mockResolvedValueOnce(new ExistEmployeeError());
    const execute = sut.execute(params);
    await expect(execute).rejects.toThrow('Employee already exists');
  });

  it('should return an error if existent employee is inactive', async () => {
    const { sut, checkEmployeeExistenceService } = await makeSut();
    const params = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'manager' as EmployeeModel.Role,
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword123',
    };
    jest
      .spyOn(checkEmployeeExistenceService, 'check')
      .mockResolvedValueOnce(new InactiveEmployeeError());
    const execute = sut.execute(params);
    await expect(execute).rejects.toThrow('Existent employee is inactive');
  });

  it('should return null if employee does not exist', async () => {
    const { sut, checkEmployeeExistenceService } = await makeSut();
    const params = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'manager' as EmployeeModel.Role,
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword123',
    };
    jest
      .spyOn(checkEmployeeExistenceService, 'check')
      .mockResolvedValueOnce(null);
    const execute = sut.execute(params);
    await expect(execute).resolves.toEqual({ id: 'valid_id' });
  });
});
