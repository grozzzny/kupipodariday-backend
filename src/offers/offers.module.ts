import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OffersController } from './offers.controller'
import { Offer } from './entities/offer.entity'
import { Wish } from '../wishes/entities/wish.entity'
import { OffersService } from './services/offers.service'

@Module({
  imports: [TypeOrmModule.forFeature([Offer, Wish])],
  controllers: [OffersController],
  providers: [OffersService],
  exports: [OffersService]
})
export class OffersModule {}
