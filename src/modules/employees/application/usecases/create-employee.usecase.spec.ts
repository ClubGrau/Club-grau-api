import { Test, TestingModule } from '@nestjs/testing';
import { CreateEmployeeUseCase } from './create-employee.usecase';

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
});
