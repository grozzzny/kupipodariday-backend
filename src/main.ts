import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {Logger, ValidationPipe} from '@nestjs/common'

const PORT = process.env.PORT ?? 3000

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  await app.listen(PORT)
  Logger.log(`🚀 Server running on http://localhost:${PORT}`, 'Bootstrap')
}
bootstrap().catch(err => console.error(err))
