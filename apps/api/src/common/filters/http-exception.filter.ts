import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { Response } from "express";

/**
 * Global HTTP Exception Filter
 *
 * Architecture Role:
 * This filter acts as a centralized error-handling layer. It intercepts all HttpException
 * instances across the application to ensure the API response follows a consistent
 * schema. This is crucial for the frontend to reliably process error messages
 * and map them to i18n translation keys.
 */
@Catch(HttpException) // Catches all instances of HttpException
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * Exception handler implementation.
   * @param exception The caught HttpException object.
   * @param host Context arguments for the current request.
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const httpContext = host.switchToHttp();
    const httpResponse = httpContext.getResponse<Response>();
    const statusCode = exception.getStatus();
    const errorResponse = exception.getResponse(); // Can be a string or an object

    httpResponse.status(statusCode).json({
      statusCode: statusCode,
      message: (errorResponse as any).message || errorResponse, // Extract message if it's an object, otherwise use the response directly
      timestamp: new Date().toISOString(),
    });
  }
}
