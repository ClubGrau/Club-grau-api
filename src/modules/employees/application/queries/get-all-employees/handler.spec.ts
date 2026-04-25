import { Test, TestingModule } from '@nestjs/testing';
import { GetAllEmployeesHandler } from './handler';
import { GetAllEmployeesQuery } from './query';

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

  it('should receive getAllEmployeesQuery params page and limit', async () => {
    const { sut } = await makeSut();
    const params = {
      page: 1,
      limit: 10,
    };
    const response = sut.execute(
      new GetAllEmployeesQuery(params.page, params.limit),
    );
    await expect(response).resolves.toBeDefined();
  });
});
