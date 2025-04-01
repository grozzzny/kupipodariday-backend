import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { User } from './users/entities/user.entity'
import { Wish } from './wishes/entities/wish.entity'
import { Wishlist } from './wishlists/entities/wishlist.entity'
import { Offer } from './offers/entities/offer.entity'
import { UsersModule } from './users/users.module'
import { WishesModule } from './wishes/wishes.module'
import { WishlistsModule } from './wishlists/wishlists.module'
import { OffersModule } from './offers/offers.module'
import { AuthModule } from './auth/auth.module'
import { APP_FILTER } from '@nestjs/core'
import { GlobalExceptionFilter } from './filters/global-exception.filter'
import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'

@Module({
  imports: [
    WinstonModule.forRoot({
      levels: {
        critical_error: 0,
        error: 1,
        info: 4
      },
      transports: [
        new winston.transports.Console({ format: winston.format.simple() }),
        new winston.transports.File({ filename: 'error.log', level: 'error' })
      ]
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('POSTGRES_URI'),
        entities: [User, Wish, Wishlist, Offer],
        synchronize: configService.get<string>('NODE_ENV') !== 'production'
      }),
      inject: [ConfigService]
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    AuthModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter
    }
  ]
})
export class AppModule {}
