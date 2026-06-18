import { Test, TestingModule } from '@nestjs/testing';
import { EmployeePoliciesService } from './employee-policies.service';
import { FindActiveEmployeeByEmail } from '../../application/ports/find-active-employee-by-email.port';
import { EmployeeNotFoundError } from '../errors/employee-not-found.error';
import { InactiveEmployeeError } from '../errors/inactive-employee.error';

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
      EmployeePoliciesService,
      {
        provide: 'FIND_ACTIVE_EMPLOYEE_BY_EMAIL',
        useValue: findActiveEmployeeByEmailStub,
      },
    ],
  }).compile();

  const sut = testModule.get<EmployeePoliciesService>(EmployeePoliciesService);

  return {
    sut,
    findActiveEmployeeByEmailStub,
  };
};

describe('EmployeePoliciesService', () => {
  it('should be defined', async () => {
    const { sut } = await makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(EmployeePoliciesService);
  });

  it('should call findActiveEmployeeByEmail with the correct email', async () => {
    const { sut, findActiveEmployeeByEmailStub } = await makeSut();
    const isExistSpy = jest.spyOn(findActiveEmployeeByEmailStub, 'isExist');

    await sut.checkIsActive('john.doe@example.com');

    expect(isExistSpy).toHaveBeenCalledWith('john.doe@example.com');
  });

  it('should return EmployeeNotFoundError if the employee does not exist', async () => {
    const { sut } = await makeSut();

    const result = await sut.checkIsActive('john.doe@example.com');

    expect(result).toBeInstanceOf(EmployeeNotFoundError);
    expect((result as Error).message).toBe('Employee not found');
  });

  it('should return InactiveEmployeeError if the employee exists but is inactive', async () => {
    const { sut, findActiveEmployeeByEmailStub } = await makeSut();
    jest.spyOn(findActiveEmployeeByEmailStub, 'isExist').mockResolvedValue({
      id: 'any_id',
      email: 'john.doe@example.com',
      isActive: false,
    });

    const result = await sut.checkIsActive('john.doe@example.com');

    expect(result).toBeInstanceOf(InactiveEmployeeError);
    expect((result as Error).message).toBe('Existent employee is inactive');
  });

  it('should return the employee data if the employee exists and is active', async () => {
    const { sut, findActiveEmployeeByEmailStub } = await makeSut();
    const activeEmployee = {
      id: 'any_id',
      email: 'john.doe@example.com',
      isActive: true,
    };
    jest
      .spyOn(findActiveEmployeeByEmailStub, 'isExist')
      .mockResolvedValue(activeEmployee);

    const result = await sut.checkIsActive('john.doe@example.com');

    expect(result).toEqual(activeEmployee);
  });
});
