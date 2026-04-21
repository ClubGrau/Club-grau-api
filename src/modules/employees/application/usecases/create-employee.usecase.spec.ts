import { Test, TestingModule } from '@nestjs/testing';
import { CreateEmployeeUseCase } from './create-employee.usecase';
import { EmployeeModel } from '../../domain/models/employee';
import { FindActiveEmployeeByEmail } from '../ports/find-active-employee-by-email.port';

const makeStubs = () => ({
  findActiveEmployeeByEmailStub: {
    isExist: jest.fn().mockResolvedValue(null) as jest.MockedFunction<
      FindActiveEmployeeByEmail['isExist']
    >,
  } satisfies FindActiveEmployeeByEmail,
});

const makeSut = async () => {
  const { findActiveEmployeeByEmailStub } = makeStubs();
  const testModule: TestingModule = await Test.createTestingModule({
    providers: [
      CreateEmployeeUseCase,
      {
        provide: 'FIND_ACTIVE_EMPLOYEE_BY_EMAIL',
        useValue: findActiveEmployeeByEmailStub,
      },
    ],
  }).compile();

  const sut = testModule.get<CreateEmployeeUseCase>(CreateEmployeeUseCase);

  return {
    sut,
    findActiveEmployeeByEmailStub,
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

  it('should call findActiveEmployeeByEmail with the correct email', async () => {
    const { sut, findActiveEmployeeByEmailStub } = await makeSut();
    const params = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'manager' as EmployeeModel.Role,
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword123',
    };
    const findEmployeeActiveSpy = jest.spyOn(
      findActiveEmployeeByEmailStub,
      'isExist',
    );
    await sut.execute(params);
    expect(findEmployeeActiveSpy).toHaveBeenCalledWith('john.doe@example.com');
  });
});
