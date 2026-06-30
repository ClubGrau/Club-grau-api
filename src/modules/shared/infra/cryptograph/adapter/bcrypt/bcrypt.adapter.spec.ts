import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt.adapter';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_value'),
  compare: jest.fn().mockResolvedValue(true),
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

  it('Should return a hash on success', async () => {
    const sut = makeSut();
    const hash = await sut.hash('any_value');
    expect(hash).toBe('hashed_value');
  });

  it('Should throw if bcrypt throws', async () => {
    const sut = makeSut();
    jest
      .spyOn(bcrypt, 'hash')
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      .mockImplementationOnce(() => Promise.reject(new Error()));
    const promise = sut.hash('any_value');
    await expect(promise).rejects.toThrow();
  });

  it('Should have a method to compare values', () => {
    const sut = makeSut();
    expect(sut.compare.bind(sut)).toBeDefined();
    expect(typeof sut.compare).toBe('function');
  });

  it('Should call bcrypt compare with correct values', async () => {
    const sut = makeSut();
    const compareSpy = jest.spyOn(bcrypt, 'compare');
    await sut.compare('any_value', 'hashed_value');
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'hashed_value');
  });

  it('Should return true on success', async () => {
    const sut = makeSut();
    const result = await sut.compare('any_value', 'hashed_value');
    expect(result).toBe(true);
  });
});
