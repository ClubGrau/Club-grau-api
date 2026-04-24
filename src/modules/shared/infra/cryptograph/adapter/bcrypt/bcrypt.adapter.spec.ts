import { BcryptAdapter } from './bcrypt.adapter';

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
});
