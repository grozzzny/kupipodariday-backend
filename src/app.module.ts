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

@Module({
  imports: [
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
  ]
})
export class AppModule {}
