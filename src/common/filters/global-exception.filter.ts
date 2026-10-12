import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import {Response} from 'express'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger('ExceptionFilter')

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()

        const isHttpException = exception instanceof HttpException
        const status = isHttpException ? exception.getStatus(): HttpStatus.INTERNAL_SERVER_ERROR
        const message = isHttpException ?exception.getResponse() : 'Something went wrong. Please try again'

        if(!isHttpException){
            this.logger.error(exception)
        }
        response.status(status).json({
            success: false,
            statusCode: status,
            timestamp: new Date().toISOString(),
            message,
        })
    }
}