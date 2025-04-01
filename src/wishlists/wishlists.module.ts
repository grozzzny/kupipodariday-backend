import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WishlistsController } from './wishlists.controller'
import { Wishlist } from './entities/wishlist.entity'
import { Wish } from '../wishes/entities/wish.entity'
import { WishlistsService } from './services/wishlists.service'

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist, Wish])],
  controllers: [WishlistsController],
  providers: [WishlistsService],
  exports: [WishlistsService]
})
export class WishlistsModule {}
