import mongoose from 'mongoose';
import { EmployeeModel } from '../../../domain/models/employee';
import { makeChainableMock } from '../../../../shared/infra/utils/setups/test-mongoose-mock';
import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeMongoRepository } from './employee-mongo.repository';

const mockEmployee = {
  _id: new mongoose.Types.ObjectId().toHexString(),
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'admin' as EmployeeModel.Role,
  password: 'hashed_password',
  nif: 123456789,
  isActive: true,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  deactivatedAt: null,
};

const mongooseMocks = () => {
  const chainableMock = makeChainableMock(mockEmployee);
  return chainableMock;
};

const makeSut = async () => {
  const employeeModelMock = {
    ...mongooseMocks(),
    countDocuments: jest.fn(),
  };
  const testModule: TestingModule = await Test.createTestingModule({
    controllers: [],
    providers: [
      EmployeeMongoRepository,
      {
        provide: 'EMPLOYEE_MODEL',
        useValue: employeeModelMock,
      },
    ],
  }).compile();

  const sut = testModule.get<EmployeeMongoRepository>(EmployeeMongoRepository);

  return { sut, employeeModelMock };
};

describe('EmployeeMongoRepository', () => {
  it('should be defined', async () => {
    const { sut } = await makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(EmployeeMongoRepository);
  });

  describe('Find Active Employee by Email', () => {
    it('should have isExist method', async () => {
      const { sut } = await makeSut();
      expect(sut.isExist.bind(sut)).toBeDefined();
      expect(typeof sut.isExist).toBe('function');
      expect(sut).toHaveProperty('isExist');
    });

    it('should findOne employee by email with a valid Mongoose query', async () => {
      const { sut, employeeModelMock } = await makeSut();

      const employeeId = new mongoose.Types.ObjectId().toHexString();
      const email = 'john.doe@example.com';

      const findOneSpy = jest
        .spyOn(employeeModelMock, 'findOne')
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValueOnce({
            lean: jest.fn().mockResolvedValueOnce({
              _id: employeeId,
              email: 'john.doe@example.com',
              isActive: true,
            }),
          }),
        });

      const result = await sut.isExist(email);
      expect(findOneSpy).toHaveBeenCalledWith({ email });
      expect(result).toEqual({
        id: employeeId,
        email: 'john.doe@example.com',
        isActive: true,
      });
    });

    it('should return null if no employee is found', async () => {
      const { sut, employeeModelMock } = await makeSut();

      const email = 'nonexistent@example.com';

      jest.spyOn(employeeModelMock, 'findOne').mockReturnValueOnce({
        select: jest.fn().mockReturnValueOnce({
          lean: jest.fn().mockResolvedValueOnce(null),
        }),
      });

      const result = await sut.isExist(email);
      expect(result).toBeNull();
    });
  });

  describe('Create new Employee', () => {
    it('should have expected method to create', async () => {
      const { sut } = await makeSut();
      expect(sut.create.bind(sut)).toBeDefined();
      expect(typeof sut.create).toBe('function');
      expect(sut).toHaveProperty('create');
    });

    it('should create a new employee with a valid Mongoose query', async () => {
      const { sut, employeeModelMock } = await makeSut();
      const employeeData = {
        id: new mongoose.Types.ObjectId().toHexString(),
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        role: 'manager' as EmployeeModel.Role,
        password: 'hashed_password',
        nif: 987654321,
        isActive: true,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        deactivateAt: null,
      };
      const createSpy = jest
        .spyOn(employeeModelMock, 'create')
        .mockResolvedValueOnce({
          _id: employeeData.id,
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          role: 'manager',
          password: 'hashed_password',
          nif: 987654321,
          isActive: true,
          createdAt: new Date('2024-01-01T00:00:00Z'),
          deactivateAt: null,
        });
      const result = await sut.create(employeeData);
      expect(createSpy).toHaveBeenCalledWith({
        _id: employeeData.id,
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        role: 'manager',
        password: 'hashed_password',
        nif: 987654321,
        isActive: true,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        deactivateAt: null,
      });
      expect(result).toEqual({ id: employeeData.id });
    });
  });

  describe('getAll Employees', () => {
    it('should have getAll method', async () => {
      const { sut } = await makeSut();
      expect(sut.getAll.bind(sut)).toBeDefined();
      expect(typeof sut.isExist).toBe('function');
      expect(sut).toHaveProperty('getAll');
    });

    it('should return an empty list of employees with total 0 if no employees are found', async () => {
      const { sut, employeeModelMock } = await makeSut();
      const options = { page: 1, limit: 10 };
      jest.spyOn(employeeModelMock, 'countDocuments').mockResolvedValueOnce(0);
      jest.spyOn(employeeModelMock, 'find').mockReturnValueOnce({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValueOnce([]),
      } as any);
      const result = await sut.getAll(options);
      expect(result).toEqual({ employees: [], total: 0 });
    });

    it('should return a list of employees and total count with a valid Mongoose query', async () => {
      const { sut, employeeModelMock } = await makeSut();
      const options = { page: 1, limit: 10 };
      const employees = [
        {
          _id: new mongoose.Types.ObjectId().toHexString(),
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          role: 'manager',
          password: 'hashed_password',
          nif: 987654321,
          isActive: true,
          createdAt: new Date('2024-01-01T00:00:00Z'),
          deactivateAt: null,
        },
        {
          _id: new mongoose.Types.ObjectId().toHexString(),
          name: 'John Smith',
          email: 'john.smith@example.com',
          role: 'developer',
          password: 'hashed_password',
          nif: 123456789,
          isActive: true,
          createdAt: new Date('2024-01-01T00:00:00Z'),
          deactivateAt: null,
        },
      ];
      const total = 2;
      jest
        .spyOn(employeeModelMock, 'countDocuments')
        .mockResolvedValueOnce(total);
      jest.spyOn(employeeModelMock, 'find').mockReturnValueOnce({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValueOnce(employees),
      } as any);
      // O resultado esperado deve ser igual ao formato retornado pelo repositório (id, sem _id, sem password)
      const expectedEmployees = employees.map((e) => ({
        id: e._id,
        name: e.name,
        email: e.email,
        role: e.role,
        nif: e.nif,
        isActive: e.isActive,
        createdAt: e.createdAt,
        deactivateAt: e.deactivateAt,
      }));
      const result = await sut.getAll(options);
      expect(result).toEqual({ employees: expectedEmployees, total });
    });
  });
});
