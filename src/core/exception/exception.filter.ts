import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        response.status(status).json({
          code: status,
          message: exception.message
        });
      } else {
        response.status(status).json(exceptionResponse);
      }
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        code: 999,
        message: 'sorry, we made a mistake. (^o^)'
      });
      console.log('error', exception); // tslint:disable-line
    }
  }
}
