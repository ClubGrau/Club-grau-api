import { Test, TestingModule } from '@nestjs/testing';
import { SigninUseCase } from './signin.usecase';
import { EmployeePoliciesService } from '../../../employees/domain/services/employee-policies.service';

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
});
