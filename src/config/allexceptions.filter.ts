import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { RequestContext } from '../common/storage/request-context';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Retrieve global request storage context for the requestId
    const store = RequestContext.getStore();
    const requestId = store?.requestId || 'req_unknown';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';

    if (exception?.response) {
      status = exception.response.status || exception.response?.statusCode || exception.status || HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.response.message || exception.response || 'Internal server error';
    } else if (exception?.status) {
      status = exception.status;
      message = exception.message || 'Internal server error';
    } else if (exception?.message) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    }

    return response.status(status).json({
      success: false,
      error: {
        statusCode: status,
        message: message,
      },
      meta: {
        requestId,
        timestamp: new Date().toISOString(),
        apiVersion: 'v1',
      },
    });
  }
}
