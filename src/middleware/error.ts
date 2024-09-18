import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import * as boom from '@hapi/boom';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';

interface ErrorResponse {
  data: any[];
  message: string;
  success: boolean;
  error?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    console.error('Error:', { path: request.url, exception });

    if (exception instanceof HttpException) {
      this.handleHttpException(exception, response);
    } else if (boom.isBoom(exception)) {
      this.handleBoomError(exception, response);
    } else if (exception instanceof PrismaClientValidationError) {
      this.handlePrismaError(exception, response);
    } else {
      this.handleDefaultError(exception, response);
    }
  }

  private handleHttpException(exception: HttpException, response: any): void {
    const status = exception.getStatus();
    const error = (exception.getResponse() as any)?.errors; // for payload validation
    const responseBody = this.createErrorResponse(exception.message, error);
    response.status(status).json(responseBody);
  }

  private handleBoomError(exception: boom.Boom, response: any): void {
    const status = exception.output.statusCode;
    const responseBody = this.createErrorResponse(exception.message);
    response.status(status).json(responseBody);
  }

  private handlePrismaError(
    exception: PrismaClientValidationError,
    response: any,
  ): void {
    let responseBody: ErrorResponse;
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (process.env.NODE_ENV === 'development') {
      responseBody = this.createErrorResponse(exception.message);
    } else {
      responseBody = this.createErrorResponse(exception.name);
    }
    response.status(status).json(responseBody);
  }

  private handleDefaultError(exception: any, response: any): void {
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.message || 'Internal server error';
    const responseBody = this.createErrorResponse(message);
    response.status(status).json(responseBody);
  }

  private createErrorResponse(message: string, error?: string): ErrorResponse {
    return {
      data: [],
      message,
      success: false,
      error,
    };
  }
}
