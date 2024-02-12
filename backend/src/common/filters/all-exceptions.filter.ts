import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const exception_ =
      exception instanceof HttpException
        ? exception
        : new InternalServerErrorException('На сервере произошла ошибка');

    const status = exception_.getStatus();
    const message = exception_.message;
    const timestamp = new Date().toISOString();
    const path = request.url;

    response.status(status).json({ message, timestamp, path });
  }
}
