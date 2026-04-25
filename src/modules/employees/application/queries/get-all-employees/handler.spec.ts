import { Test, TestingModule } from '@nestjs/testing';
import { GetAllEmployeesHandler } from './handler';
import { GetAllEmployeesQuery } from './query';
import { EmployeeModel } from '../../../domain/models/employee';
import { GetAllEmployeesRepositoryPort } from '../../ports/get-all-employees.repository.port';
import { GetAllEmployeesResult } from './result';

const makeStubs = () => ({
  getAllEmployeesStub: {
    getAll: jest.fn().mockResolvedValue({
      employees: [
        {
          id: 'valid_employee_id',
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: 'password123',
          nif: 123456789,
          role: EmployeeModel.Role.Admin,
          isActive: true,
          createdAt: new Date('2024-06-01T00:00:00Z'),
          deactivateAt: null,
        },
      ] as EmployeeModel.PrimitivesData[],
      total: 1,
    }) as jest.MockedFunction<GetAllEmployeesRepositoryPort['getAll']>,
  } satisfies GetAllEmployeesRepositoryPort,
});

const makeSut = async () => {
  const { getAllEmployeesStub } = makeStubs();
  const testModule: TestingModule = await Test.createTestingModule({
    providers: [
      GetAllEmployeesHandler,
      {
        provide: 'GET_ALL_EMPLOYEES_REPOSITORY_PORT',
        useValue: getAllEmployeesStub,
      },
    ],
  }).compile();

  const sut = testModule.get<GetAllEmployeesHandler>(GetAllEmployeesHandler);

  return {
    sut,
    getAllEmployeesStub,
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

  it('should call GetAllEmployeesRepository with correct params', async () => {
    const { sut, getAllEmployeesStub } = await makeSut();
    const params = {
      page: 2,
      limit: 10,
    };
    const getAllEmployeesSpy = jest.spyOn(getAllEmployeesStub, 'getAll');
    const response = sut.execute(
      new GetAllEmployeesQuery(params.page, params.limit),
    );
    await expect(response).resolves.toBeDefined();
    expect(getAllEmployeesSpy).toHaveBeenCalledWith({
      page: params.page,
      limit: params.limit,
    });
  });

  it('should apply default values for page and limit if not provided', async () => {
    const { sut, getAllEmployeesStub } = await makeSut();
    const getAllEmployeesSpy = jest.spyOn(getAllEmployeesStub, 'getAll');
    const response = sut.execute(
      new GetAllEmployeesQuery(undefined, undefined),
    );

    await expect(response).resolves.toBeDefined();
    expect(getAllEmployeesSpy).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
    });
  });

  it('should return GetAllEmployeesResult with repository data', async () => {
    const { sut, getAllEmployeesStub } = await makeSut();
    const employees = [
      {
        id: 'valid_employee_id',
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        nif: 123456789,
        role: EmployeeModel.Role.Admin,
        isActive: true,
        createdAt: new Date('2024-06-01T00:00:00Z'),
        deactivateAt: null,
      },
    ];
    const total = 1;
    jest
      .spyOn(getAllEmployeesStub, 'getAll')
      .mockResolvedValueOnce({ employees, total });

    const response = sut.execute(new GetAllEmployeesQuery(1, 10));
    await expect(response).resolves.toBeDefined();
    expect(await response).toEqual(new GetAllEmployeesResult(employees, total));
    expect(getAllEmployeesStub.getAll).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
    });
    expect(await response).toEqual({
      employees,
      total,
    });
  });
});
