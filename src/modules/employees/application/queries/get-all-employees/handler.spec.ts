import { Test, TestingModule } from '@nestjs/testing';
import { GetAllEmployeesHandler } from './handler';

const makeSut = async () => {
  const testModule: TestingModule = await Test.createTestingModule({
    providers: [GetAllEmployeesHandler],
  }).compile();

  const sut = testModule.get<GetAllEmployeesHandler>(GetAllEmployeesHandler);

  return {
    sut,
  };
};

describe('GetAllEmployeesHandler', () => {
  it('should be defined', async () => {
    const { sut } = await makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(GetAllEmployeesHandler);
  });

  it('should have a method execute', async () => {
    const { sut } = await makeSut();
    expect(sut.execute.bind(sut)).toBeDefined();
    expect(typeof sut.execute).toBe('function');
  });
});
