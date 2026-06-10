import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';

const makeSut = async () => {
  const testModule: TestingModule = await Test.createTestingModule({
    controllers: [AuthController],
    providers: [],
  }).compile();

  const sut = testModule.get<AuthController>(AuthController);

  return {
    sut,
  };
};

describe('AuthController', () => {
  it('should be defined', async () => {
    const { sut } = await makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(AuthController);
  });
});
