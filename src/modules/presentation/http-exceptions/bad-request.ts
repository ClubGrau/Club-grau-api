import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequest extends HttpException {
  constructor(message: string) {
    super(`Missing param: ${message}`, HttpStatus.BAD_REQUEST);
  }
}
