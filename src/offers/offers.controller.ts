import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common'
import { CreateOfferDto } from './dto/create-offer.dto'
import { OffersService } from './services/offers.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { GetUser } from '../auth/decorators/get-user.decorator'
import { User } from '../users/entities/user.entity'
import {Offer} from "./entities/offer.entity";

@Controller('offers')
@UseGuards(JwtAuthGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@GetUser() user: User, @Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(user, createOfferDto)
  }

  @Get()
  findAll(): Promise<Offer[]> {
    return this.offersService.findAll()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Offer> {
    return this.offersService.findOne({ id })
  }
}
