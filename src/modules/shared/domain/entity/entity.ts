import UniqueEntityId from '../value-object/id/unique-entity-id.vo';
import { ValueObject } from '../value-object/value-object';

type UnwrapVO<T> = T extends ValueObject<infer V> ? V : T;

type VOProps<T> = {
  [k in keyof T]: UnwrapVO<T[k]>;
};

export class Entity<Props> {
  public readonly uniqueEntityId: UniqueEntityId;

  constructor(
    public readonly props: Props,
    id?: UniqueEntityId,
  ) {
    this.uniqueEntityId = id || new UniqueEntityId();
  }

  get id(): string {
    return this.uniqueEntityId.getValue();
  }

  toJSON(): Required<{ id: string } & Props> {
    return {
      id: this.id,
      ...this.unwrapValueObjectProps(this.props),
    } as Required<{ id: string } & Props>;
  }

  private unwrapValueObjectProps(props: Props): VOProps<Props> {
    const unwrappedProps = {} as VOProps<Props>;

    for (const key of Object.keys(props as object)) {
      const value = (props as Record<string, unknown>)[key];
      unwrappedProps[key as keyof VOProps<Props>] = (
        value instanceof ValueObject
          ? (value as ValueObject<unknown>).getValue()
          : value
      ) as VOProps<Props>[keyof VOProps<Props>];
    }

    return unwrappedProps;
  }
}
