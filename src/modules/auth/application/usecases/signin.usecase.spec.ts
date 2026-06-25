import { Test, TestingModule } from '@nestjs/testing';
import { SigninUseCase } from './signin.usecase';
import { EmployeePoliciesService } from '../../../employees/domain/services/employee-policies.service';
import { EmployeeNotFoundError } from '../../../employees/domain/errors/employee-not-found.error';
import { InactiveEmployeeError } from '../../../employees/domain/errors/inactive-employee.error';

const makeStubs = () => ({
  employeePoliciesServiceStub: {
    checkIsActive: jest.fn().mockResolvedValue(null) as jest.MockedFunction<
      EmployeePoliciesService['checkIsActive']
    >,
  } satisfies Pick<EmployeePoliciesService, 'checkIsActive'>,
});

const makeSut = async () => {
  const { employeePoliciesServiceStub } = makeStubs();
  const testModule: TestingModule = await Test.createTestingModule({
    providers: [
      SigninUseCase,
      {
        provide: EmployeePoliciesService,
        useValue: employeePoliciesServiceStub,
      },
    ],
  }).compile();
  const sut = testModule.get<SigninUseCase>(SigninUseCase);
  return { sut, employeePoliciesServiceStub };
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
});
