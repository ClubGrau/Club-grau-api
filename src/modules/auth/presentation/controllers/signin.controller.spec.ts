import { Test, TestingModule } from '@nestjs/testing';
import { SigninController } from './signin.controller';
import { MissingParamError } from '../../../employees/presentation/errors/missing-param.error';
import { BadRequest } from '../../../employees/presentation/http-exceptions/bad-request';
import { SigninUseCase } from '../../application/usecases/signin.usecase';

const makeStubs = () => ({
  signinStub: {
    execute: jest
      .fn()
      .mockResolvedValue({ token: 'valid_token' }) as jest.MockedFunction<
      SigninUseCase['execute']
    >,
  } satisfies SigninUseCase,
});

const makeSut = async () => {
  const { signinStub } = makeStubs();
  const testModule: TestingModule = await Test.createTestingModule({
    controllers: [SigninController],
    providers: [
      {
        provide: SigninUseCase,
        useValue: signinStub,
      },
    ],
  }).compile();

  const sut = testModule.get<SigninController>(SigninController);

  return {
    sut,
    signinStub,
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

  it('should return badRequest if no password is provided', async () => {
    const { sut } = await makeSut();
    const request = {
      email: 'valid_email@mail.com',
      password: '',
    };
    const response = sut.handle(request);
    await expect(response).rejects.toThrow(BadRequest);
    await expect(response).rejects.toThrow(
      new MissingParamError('password').message,
    );
  });

  it('show should call Signin with correct params', async () => {
    const { sut, signinStub } = await makeSut();
    const executeSpy = jest.spyOn(signinStub, 'execute');
    const request = {
      email: 'valid_email@mail.com',
      password: 'anypassword',
    };
    await sut.handle(request);
    expect(executeSpy).toHaveBeenCalledWith({
      email: 'valid_email@mail.com',
      password: 'anypassword',
    });
  });
});
