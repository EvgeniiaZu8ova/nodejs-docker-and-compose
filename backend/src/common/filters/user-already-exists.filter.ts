import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { UserAlreadyExistsException } from '../exceptions/user-already-exists.exception';

@Catch(UserAlreadyExistsException)
export class UserAlreadyExistsExceptionFilter implements ExceptionFilter {
  catch(exception: UserAlreadyExistsException, host: ArgumentsHost) {
    const status = exception.getStatus();
    const message = exception.getResponse();

    const ctx = host.switchToHttp();

    const request = ctx.getRequest();
    const response = ctx.getResponse();

    response.status(status).json({
      error: {
        status,
        message,
        method: request.method,
        url: request.url,
      },
    });
  }
}
