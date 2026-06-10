import { Test, TestingModule } from '@nestjs/testing';
import { SigninController } from './signin.controller';

const makeSut = async () => {
  const testModule: TestingModule = await Test.createTestingModule({
    controllers: [SigninController],
    providers: [],
  }).compile();

  const sut = testModule.get<SigninController>(SigninController);

  return {
    sut,
  };
};

describe('SigninController', () => {
  it('should be defined', async () => {
    const { sut } = await makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(SigninController);
  });
});
