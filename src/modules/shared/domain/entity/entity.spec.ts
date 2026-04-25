import UniqueEntityId from '../value-object/id/unique-entity-id.vo';
import { ValueObject } from '../value-object/value-object';
import { Entity } from './entity';

class StubEntity extends Entity<{ prop1: string; prop2: number }> {}
class StubValueObject extends ValueObject<string> {
  static create(value: string) {
    return new StubValueObject(value);
  }
}
class StubEntityWithVO extends Entity<{
  name: StubValueObject;
  age: number;
}> {}

describe('Entity Unit Tests', () => {
  it('should set props and id', () => {
    const arrange = { prop1: 'prop1 value', prop2: 10 };
    const entity = new StubEntity(arrange);
    expect(entity.props).toStrictEqual(arrange);
    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    expect(entity.id).toBe(entity.uniqueEntityId.getValue());
  });

  it('should accept a valid uuid', () => {
    const arrange = { prop1: 'prop1 value', prop2: 10 };
    const referenceEntity = new StubEntity(arrange);
    const entity = new StubEntity(arrange, referenceEntity.uniqueEntityId);
    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    expect(entity.id).toBe(referenceEntity.id);
  });

  it('should convert an entity to a JavaScript Object', () => {
    const arrange = { prop1: 'prop1 value', prop2: 10 };
    const entity = new StubEntity(arrange);
    expect(entity.toJSON()).toStrictEqual({
      id: entity.id,
      ...arrange,
    });
  });

  it('should keep primitive props as-is when converting to JSON', () => {
    const arrange = { prop1: 'value', prop2: 42 };
    const entity = new StubEntity(arrange);

    const json = entity.toJSON();
    expect(json.prop1).toBe('value');
    expect(json.prop2).toBe(42);
  });

  it('should unwrap ValueObject props when converting to JSON', () => {
    const name = StubValueObject.create('John Doe');
    const entity = new StubEntityWithVO({ name, age: 30 });

    expect(entity.toJSON()).toStrictEqual({
      id: entity.id,
      name: 'John Doe',
      age: 30,
    });
  });

  it('should keep primitive props as-is when converting to JSON', () => {
    const arrange = { prop1: 'value', prop2: 42 };
    const entity = new StubEntity(arrange);

    const json = entity.toJSON();
    expect(json.prop1).toBe('value');
    expect(json.prop2).toBe(42);
  });
});
