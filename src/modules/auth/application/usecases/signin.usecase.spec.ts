import { Test, TestingModule } from '@nestjs/testing';
import { SigninUseCase } from './signin.usecase';

const makeStubs = () => ({});

const makeSut = async () => {
  makeStubs();
  const testModule: TestingModule = await Test.createTestingModule({
    providers: [SigninUseCase],
  }).compile();
  const sut = testModule.get<SigninUseCase>(SigninUseCase);
  return { sut };
};

describe('SigninUseCase', () => {
  it('should be defined', async () => {
    const { sut } = await makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(SigninUseCase);
  });
});
