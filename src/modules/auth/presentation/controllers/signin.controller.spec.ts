import { Test, TestingModule } from '@nestjs/testing';
import { SigninController } from './signin.controller';
import { MissingParamError } from '../../../employees/presentation/errors/missing-param.error';
import { BadRequest } from '../../../employees/presentation/http-exceptions/bad-request';

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

  it('should receive email and password in the request body', async () => {
    const { sut } = await makeSut();
    const request = {
      email: 'john.doe@example.com',
      password: 'P@ssword123',
    };
    const handleSpy = jest.spyOn(sut, 'handle');
    await sut.handle(request);
    expect(handleSpy).toHaveBeenCalledWith({
      email: 'john.doe@example.com',
      password: 'P@ssword123',
    });
  });

  it('should return badRequest if email is not provided', async () => {
    const { sut } = await makeSut();
    const request = {
      email: '',
      password: 'P@ssword123',
    };
    const response = sut.handle(request);
    await expect(response).rejects.toThrow(BadRequest);
    await expect(response).rejects.toThrow(
      new MissingParamError('email').message,
    );
  });
});
