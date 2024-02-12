import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const status = exception.getStatus();
    const ctx = host.switchToHttp();

    const request = ctx.getRequest();
    const response = ctx.getResponse();

    response.status(status).json({
      error: {
        status,
        message: 'Неверный формат отправки данных запроса',
        method: request.method,
        url: request.url,
      },
    });
  }
}
