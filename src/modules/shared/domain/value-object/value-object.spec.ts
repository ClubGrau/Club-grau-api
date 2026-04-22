import { ValueObject } from './value-object';

const makeSut = () => {
  class StringVO extends ValueObject<string> {
    constructor(value: string) {
      super(value);
    }
  }

  class ObjectVO extends ValueObject<{ name: string; age: number }> {
    constructor(value: { name: string; age: number }) {
      super(value);
    }
  }
  return { StringVO, ObjectVO };
};

describe('ValueObject', () => {
  it('should be defined', () => {
    const { StringVO, ObjectVO } = makeSut();
    expect(ValueObject).toBeDefined();
    expect(StringVO).toBeDefined();
    expect(ObjectVO).toBeDefined();
  });

  describe('getValue()', () => {
    it('should return the stored primitive value', () => {
      const { StringVO } = makeSut();
      const vo = new StringVO('hello');
      expect(vo.getValue()).toBe('hello');
    });

    it('should return the stored object value', () => {
      const { ObjectVO } = makeSut();
      const data = { name: 'John', age: 30 };
      const vo = new ObjectVO(data);
      expect(vo.getValue()).toEqual(data);
    });
  });

  describe('equals()', () => {
    it('should return true when two value objects have the same primitive value', () => {
      const { StringVO } = makeSut();
      const vo1 = new StringVO('test');
      const vo2 = new StringVO('test');
      expect(vo1.equals(vo2)).toBe(true);
    });

    it('should return false when two value objects have different primitive values', () => {
      const { StringVO } = makeSut();
      const vo1 = new StringVO('test');
      const vo2 = new StringVO('different');
      expect(vo1.equals(vo2)).toBe(false);
    });

    it('should return true when two value objects have equivalent object values', () => {
      const { ObjectVO } = makeSut();
      const vo1 = new ObjectVO({ name: 'John', age: 30 });
      const vo2 = new ObjectVO({ name: 'John', age: 30 });
      expect(vo1.equals(vo2)).toBe(true);
    });

    it('should return false when two value objects have different object values', () => {
      const { ObjectVO } = makeSut();
      const vo1 = new ObjectVO({ name: 'John', age: 30 });
      const vo2 = new ObjectVO({ name: 'Jane', age: 25 });
      expect(vo1.equals(vo2)).toBe(false);
    });
  });
});
