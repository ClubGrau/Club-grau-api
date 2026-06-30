import type { SigninModel } from '../../domain/models/signin';

export interface GenerateTokenPort<T extends object> {
  generate(payload: T): SigninModel.ResponseDto;
}
