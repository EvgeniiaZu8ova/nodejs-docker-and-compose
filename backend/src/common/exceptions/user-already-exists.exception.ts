import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super('Такой пользователь уже существует', HttpStatus.BAD_REQUEST);
  }
}
