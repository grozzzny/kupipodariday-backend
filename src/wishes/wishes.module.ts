import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WishesController } from './wishes.controller'
import { Wish } from './entities/wish.entity'
import { WishesService } from './services/wishes.service'

@Module({
  imports: [TypeOrmModule.forFeature([Wish])],
  controllers: [WishesController],
  providers: [WishesService],
  exports: [WishesService]
})
export class WishesModule {}
