import { Test, TestingModule } from '@nestjs/testing';
import { CreateEmployeeController } from './create-employee.controller';

const makeSut = async () => {
  const testModule: TestingModule = await Test.createTestingModule({
    controllers: [CreateEmployeeController],
    providers: [],
  }).compile();

  const sut = testModule.get<CreateEmployeeController>(
    CreateEmployeeController,
  );

  return {
    sut,
  };
};

describe('CreateEmployeeController', () => {
  it('should be defined', async () => {
    const { sut } = await makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(CreateEmployeeController);
  });
});
