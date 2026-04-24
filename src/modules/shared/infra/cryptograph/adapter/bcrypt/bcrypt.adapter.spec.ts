import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt.adapter';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_value'),
}));

const makeSut = (): BcryptAdapter => new BcryptAdapter();

describe('BcryptAdapter', () => {
  it('should be defined', () => {
    const sut = makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(BcryptAdapter);
  });

  it('should have a hash method', () => {
    const sut = makeSut();
    expect(sut.hash.bind(sut)).toBeDefined();
    expect(typeof sut.hash).toBe('function');
  });

  it('Should call bcript with correct values', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    const salt = 10;
    await sut.hash('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });
});
