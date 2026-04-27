import { Test, TestingModule } from '@nestjs/testing';
import { GetAllEmployeesController } from './get-all-employees.controller';
import { IQueryBus, QueryBus } from '@nestjs/cqrs';

const makeStubs = () => ({
  queryBusStub: {
    execute: jest.fn(),
  } as unknown as IQueryBus,
});

const makeSut = async () => {
  const { queryBusStub } = makeStubs();

  const testModule: TestingModule = await Test.createTestingModule({
    controllers: [GetAllEmployeesController],
    providers: [
      {
        provide: QueryBus,
        useValue: queryBusStub,
      },
    ],
  }).compile();

  const sut = testModule.get<GetAllEmployeesController>(
    GetAllEmployeesController,
  );

  return {
    sut,
    queryBusStub,
  };
};

describe('GetAllEmployeesController', () => {
  it('should be defined', async () => {
    const { sut } = await makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(GetAllEmployeesController);
  });

  it('should call queryBus to execute GetAllEmployeesQuery', async () => {
    const { sut, queryBusStub } = await makeSut();
    const params = { page: '1', limit: '10' };
    const getQueryStub = (
      queryBusStub.execute as jest.Mock
    ).mockResolvedValueOnce([]);
    await sut.handle(params.page, params.limit);
    expect(getQueryStub).toHaveBeenCalledWith(
      expect.objectContaining({
        page: Number(params.page),
        limit: Number(params.limit),
      }),
    );
  });
});
