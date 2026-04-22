export abstract class ValueObject<T> {
  protected readonly _value: T;

  protected constructor(value: T) {
    this._value = value;
  }

  getValue(): T {
    return this._value;
  }

  equals(other: ValueObject<T>): boolean {
    return JSON.stringify(this._value) === JSON.stringify(other._value);
  }
}
