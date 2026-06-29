import { JwtAdapter } from './jwt-adapter';

const makeStubs = () => ({});

const makeSut = (): JwtAdapter => {
  makeStubs();
  return new JwtAdapter();
};

describe('JwtAdapter', () => {
  it('should be defined', () => {
    const sut = makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(JwtAdapter);
  });
});
