import { Test, TestingModule } from '@nestjs/testing';
import { GetAllEmployeesController } from './get-all-employees.controller';
import { IQueryBus, QueryBus } from '@nestjs/cqrs';
import { EmployeeModel } from '../../domain/models/employee';
import { GetAllEmployeesQuery } from '../../application/queries/get-all-employees/query';

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
    ).mockResolvedValueOnce({ employees: [], total: 0 });
    await sut.handle(params.page, params.limit);
    expect(getQueryStub).toHaveBeenCalledWith(
      expect.objectContaining({
        page: Number(params.page),
        limit: Number(params.limit),
      }),
    );
  });

  it('should return a list of employees and total count with default pagination', async () => {
    const { sut, queryBusStub } = await makeSut();
    const employees = [
      {
        id: 'valid_employee_id',
        name: 'John Doe',
        email: 'john.doe@example.com',
        nif: 123456789,
        role: 'admin',
        isActive: true,
        createdAt: new Date('2024-06-01T00:00:00Z'),
        deactivateAt: null,
      },
    ] as EmployeeModel.PrimitivesData[];

    const total = 1;
    const getQueryStub = (
      queryBusStub.execute as jest.Mock
    ).mockResolvedValueOnce({
      employees,
      total,
    });

    const response = await sut.handle(undefined, undefined);
    expect(response).toEqual({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: expect.any(Array),
      total,
    });
    expect(response.data[0]).toEqual(
      expect.objectContaining({
        id: 'valid_employee_id',
        name: 'John Doe',
        email: 'john.doe@example.com',
        nif: 123456789,
        role: 'admin',
        isActive: true,
        createdAt: new Date('2024-06-01T00:00:00Z'),
        deactivateAt: null,
      }),
    );
    expect(getQueryStub).toHaveBeenCalledWith(new GetAllEmployeesQuery(1, 10));
  });

  it('should reflect the total value returned by QueryBus without transformation', async () => {
    const { sut, queryBusStub } = await makeSut();
    const employees = [] as EmployeeModel.PrimitivesData[];
    const total = 42;
    (queryBusStub.execute as jest.Mock).mockResolvedValueOnce({
      employees,
      total,
    });
    const response = await sut.handle(undefined, undefined);
    expect(response.total).toBe(total);
  });

  it('should always return data as an array, even if employees is empty', async () => {
    const { sut, queryBusStub } = await makeSut();
    (queryBusStub.execute as jest.Mock).mockResolvedValueOnce({
      employees: [],
      total: 0,
    });
    const response = await sut.handle(undefined, undefined);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data).toEqual([]);
  });
});
