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
  const employeeModelMock = mongooseMocks();
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
  });
});
