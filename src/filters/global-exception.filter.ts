import { Catch, ExceptionFilter, ArgumentsHost, BadRequestException } from '@nestjs/common'
import { Response } from 'express'
import { QueryFailedError } from 'typeorm'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    let status = exception.status || 500
    let message = exception.message || 'Internal Server Error'

    if (exception instanceof QueryFailedError && exception.driverError.code === '23505') {
      status = 409
      message = exception.driverError.detail
    }

    if (exception instanceof BadRequestException) {
      return response.status(status).json(exception.getResponse())
    }

    console.error(exception)

    response.status(status).json({
      statusCode: status,
      message: message
    })
  }
}
