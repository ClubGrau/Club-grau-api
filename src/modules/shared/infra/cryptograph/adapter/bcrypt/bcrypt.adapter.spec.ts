import { BcryptAdapter } from './bcrypt.adapter';

describe('BcryptAdapter', () => {
  it('should be defined', () => {
    const sut = new BcryptAdapter();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(BcryptAdapter);
  });
});
