import { Catch, ExceptionFilter, ArgumentsHost, BadRequestException, Inject } from '@nestjs/common'
import { Response } from 'express'
import { QueryFailedError } from 'typeorm'
import { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    let status: number = exception.status || 500
    let message: string = exception.message || 'Internal Server Error'

    if (exception instanceof QueryFailedError && exception.driverError.code === '23505') {
      status = 409
      message = 'Ошибка! Уже существует'
    }

    if (exception instanceof BadRequestException) {
      return response.status(status).json(exception.getResponse())
    }

    if (status >= 500) {
      this.logger.error({ message, statusCode: status })
    } else {
      this.logger.info({ message, statusCode: status })
    }

    response.status(status).json({
      statusCode: status,
      message: message
    })
  }
}
