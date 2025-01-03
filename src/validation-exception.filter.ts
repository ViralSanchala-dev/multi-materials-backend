import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest();

        const errors = exception.getResponse() as any;

        const firstError = this.getFirstError(errors.message);

        response.status(exception.getStatus()).json({
            statusCode: exception.getStatus(),
            timestamp: new Date().toISOString(),
            path: request.url,
            message: firstError, // Return only the first error
        });
    }

    private getFirstError(messages: string[]): string {
        if (Array.isArray(messages) && messages.length > 0) {
            return messages[0]; // Return the first message from the array
        } else if (typeof messages === 'string' && messages !== null) {
            return messages; // Recursively call the function for nested objects
        }
        return 'Validation failed';
    }
}

