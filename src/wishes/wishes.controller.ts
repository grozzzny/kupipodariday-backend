import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, ParseIntPipe } from '@nestjs/common'
import { CreateWishDto } from './dto/create-wish.dto'
import { WishesService } from './services/wishes.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { GetUser } from '../auth/decorators/get-user.decorator'
import { User } from '../users/entities/user.entity'
import { Wish } from './entities/wish.entity'
import { UpdateWishDto } from './dto/update-wish.dto'

@Controller('wishes')
@UseGuards(JwtAuthGuard)
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  create(@GetUser() user: User, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(user.id, createWishDto)
  }

  @Get('last')
  findLast(): Promise<Wish[]> {
    return this.wishesService.findLast()
  }

  @Get('top')
  findTop(): Promise<Wish[]> {
    return this.wishesService.findTop()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.wishesService.findOne({ id })
  }

  @Patch(':id')
  update(@GetUser() user: User, @Param('id', ParseIntPipe) id: number, @Body() updateData: UpdateWishDto) {
    return this.wishesService.updateOne({ id }, user.id, updateData)
  }

  @Delete(':id')
  remove(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.wishesService.removeOne({ id }, user.id)
  }

  @Post(':id/copy')
  copy(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.wishesService.copy({ id }, user)
  }
}
