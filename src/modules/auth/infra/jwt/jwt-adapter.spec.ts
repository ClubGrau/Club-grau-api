import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { EmployeeModel } from '../../../employees/domain/models/employee';
import { JwtAdapter } from './jwt-adapter';
import { EmployeeTokenPayload } from './types/jwt.types';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('valid_token'),
}));

const makeStubs = () => ({
  configServiceStub: {
    getOrThrow: jest.fn().mockReturnValue('any_secret'),
  } satisfies Pick<ConfigService, 'getOrThrow'>,
});

const makeSut = () => {
  const { configServiceStub } = makeStubs();
  const sut = new JwtAdapter(configServiceStub as unknown as ConfigService);
  return { sut, configServiceStub };
};

describe('JwtAdapter', () => {
  it('should be defined', () => {
    const { sut } = makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(JwtAdapter);
  });

  it('should call jwt sign to generate a valid token', () => {
    const { sut, configServiceStub } = makeSut();
    const signSpy = jest.spyOn(jwt, 'sign');
    const payload: EmployeeTokenPayload = {
      sub: 'any_id',
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      role: EmployeeModel.Role.Employee,
    };
    const { token } = sut.generate(payload);
    expect(configServiceStub.getOrThrow).toHaveBeenCalledWith('JWT_SECRET');
    expect(signSpy).toHaveBeenCalledWith(payload, 'any_secret', {
      expiresIn: '30h',
    });
    expect(token).toBe('valid_token');
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });
});
