import { Test, TestingModule } from '@nestjs/testing';
import { CheckEmployeeExistenceService } from './check-employee-existence.service';
import { FindActiveEmployeeByEmail } from '../../application/ports/find-active-employee-by-email.port';
import { ExistEmployeeError } from '../errors/exist-employee.error';
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
    controllers: [],
    providers: [
      CheckEmployeeExistenceService,
      {
        provide: 'FIND_ACTIVE_EMPLOYEE_BY_EMAIL',
        useValue: findActiveEmployeeByEmailStub,
      },
    ],
  }).compile();

  const sut = testModule.get<CheckEmployeeExistenceService>(
    CheckEmployeeExistenceService,
  );

  return {
    sut,
    findActiveEmployeeByEmailStub,
  };
};

describe('CheckEmployeeExistenceService', () => {
  it('should be defined', async () => {
    const { sut } = await makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(CheckEmployeeExistenceService);
  });

  it('should call findByEmail with the correct email', async () => {
    const { sut, findActiveEmployeeByEmailStub } = await makeSut();
    const email = 'john.doe@example.com';
    const findByEmailSpy = jest.spyOn(findActiveEmployeeByEmailStub, 'isExist');

    await sut.check(email);
    expect(findByEmailSpy).toHaveBeenCalledWith('john.doe@example.com');
  });

  it('should return an error if the employee is inactive', async () => {
    const { sut, findActiveEmployeeByEmailStub } = await makeSut();
    const email = 'john.doe@example.com';
    jest.spyOn(findActiveEmployeeByEmailStub, 'isExist').mockResolvedValue({
      id: 'existing_employee_id',
      email: 'john.doe@example.com',
      isActive: false,
    });

    const result = await sut.check(email);
    expect(result).toBeInstanceOf(InactiveEmployeeError);
    expect(result?.message).toBe('Existent employee is inactive');
  });

  it('should return an error if the employee already exists', async () => {
    const { sut, findActiveEmployeeByEmailStub } = await makeSut();
    const email = 'john.doe@example.com';
    jest.spyOn(findActiveEmployeeByEmailStub, 'isExist').mockResolvedValue({
      id: 'existing_employee_id',
      email: 'john.doe@example.com',
      isActive: true,
    });
    const result = await sut.check(email);
    expect(result).toBeInstanceOf(ExistEmployeeError);
    expect(result?.message).toBe('Employee already exists');
  });

  it('should return null if the employee does not exist', async () => {
    const { sut } = await makeSut();
    const email = 'john.doe@example.com';
    const result = await sut.check(email);
    expect(result).toBeNull();
  });
});
